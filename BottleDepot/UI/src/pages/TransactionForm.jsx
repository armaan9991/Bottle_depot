import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
// import { getAllCustomers } from '../api/customers';
// import { getAllContainerTypes } from '../api/containerTypes';
// import { getTodayRecord } from '../api/dailyRecords';
import { createTransaction } from '../api/transactions';
import styles from './Transaction.module.css';

export default function TransactionForm() {
    const { user }   = useAuth();
    const navigate   = useNavigate();

    // ── dropdowns ──
    const [customers,       setCustomers]       = useState([]);
    const [containerTypes,  setContainerTypes]  = useState([]);
    const [todayRecord,     setTodayRecord]     = useState(null);

    // ── form state ──
    const [customerID,  setCustomerID]  = useState('');
    const [lines, setLines] = useState([
        { containerTypeID: '', quantity: '', unitValue: 0, value: 0 }
    ]);

    const [error,   setError]   = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        Promise.all([
            // getAllCustomers(),
            getAllContainerTypes(),
            getTodayRecord(),
        ]).then(([cRes, ctRes, recRes]) => {
            setCustomers(cRes.data);
            setContainerTypes(ctRes.data);
            setTodayRecord(recRes.data);
        }).catch(() => setError('Failed to load form data. Is the backend running?'));
    }, []);

    // ── line item helpers ──
    const addLine = () =>
        setLines(prev => [...prev, { containerTypeID: '', quantity: '', unitValue: 0, value: 0 }]);

    const removeLine = (idx) =>
        setLines(prev => prev.filter((_, i) => i !== idx));

    const updateLine = (idx, field, val) => {
        setLines(prev => {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], [field]: val };

            // auto-calculate value when quantity or type changes
            if (field === 'containerTypeID') {
                const ct = containerTypes.find(c => c.containerTypeID === parseInt(val));
                updated[idx].unitValue = ct ? ct.refund : 0;
                updated[idx].value     = ct ? ct.refund * (parseFloat(updated[idx].quantity) || 0) : 0;
            }
            if (field === 'quantity') {
                updated[idx].value = updated[idx].unitValue * (parseFloat(val) || 0);
            }

            return updated;
        });
    };

    // ── computed totals ──
    const totalContainers = lines.reduce((s, l) => s + (parseInt(l.quantity) || 0), 0);
    const total           = lines.reduce((s, l) => s + (l.value || 0), 0);

    // ── submit ──
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!customerID)            return setError('Please select a customer.');
        if (!todayRecord)           return setError('No open daily record found for today.');
        if (lines.some(l => !l.containerTypeID || !l.quantity))
                                    return setError('Please fill in all line items.');

        setLoading(true);
        try {
            const payload = {
                customerID:      parseInt(customerID),
                workID:          user.workId,
                recordID:        todayRecord.recordID,
                total:           parseFloat(total.toFixed(2)),
                totalContainers: totalContainers,
                details: lines.map(l => ({
                    containerTypeID: parseInt(l.containerTypeID),
                    quantity:        parseInt(l.quantity),
                    unitValue:       parseFloat(l.unitValue),
                    value:           parseFloat(l.value.toFixed(2)),
                })),
            };

            await createTransaction(payload);
            setSuccess('Transaction created successfully!');

            // reset form
            setCustomerID('');
            setLines([{ containerTypeID: '', quantity: '', unitValue: 0, value: 0 }]);

            // redirect after 1.5s
            setTimeout(() => {
                navigate(user.role === 'Admin' ? '/admin/dashboard' : '/employee/dashboard');
            }, 1500);
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to create transaction.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.txnPage}>
            <div className={styles.txnHeader}>
                <h2 className={styles.txnTitle}>New transaction</h2>
                <p className={styles.txnSubtitle}>
                    {todayRecord
                        ? `Daily record #${todayRecord.recordID} is open`
                        : 'Loading daily record…'}
                </p>
            </div>

            {error   && <p className={styles.txnError}>{error}</p>}
            {success && <p className={styles.txnSuccess}>{success}</p>}

            <form onSubmit={handleSubmit}>
                <div className={styles.txnGrid}>

                    {/* ── Left: details + line items ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Customer + employee */}
                        <div className={styles.txnPanel}>
                            <div className={styles.txnPanelHead}>
                                <span className={styles.txnPanelTitle}>Transaction details</span>
                            </div>
                            <div className={styles.txnPanelBody}>
                                <div className={styles.txnFormRow}>
                                    <div className={styles.txnField}>
                                        <label>Customer</label>
                                        <select
                                            value={customerID}
                                            onChange={e => setCustomerID(e.target.value)}
                                            required
                                        >
                                            <option value="">Select customer…</option>
                                            {customers.map(c => (
                                                <option key={c.customerID} value={c.customerID}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className={styles.txnField}>
                                        <label>Processed by</label>
                                        <input
                                            value={user?.name || ''}
                                            disabled
                                            style={{ opacity: 0.6, cursor: 'not-allowed' }}
                                        />
                                    </div>
                                </div>
                                <div className={styles.txnFormRow}>
                                    <div className={styles.txnField}>
                                        <label>Daily record</label>
                                        <input
                                            value={todayRecord
                                                ? `#${todayRecord.recordID} — ${new Date(todayRecord.recordDate).toLocaleDateString()}`
                                                : 'Loading…'}
                                            disabled
                                            style={{ opacity: 0.6, cursor: 'not-allowed' }}
                                        />
                                    </div>
                                    <div className={styles.txnField}>
                                        <label>Date</label>
                                        <input
                                            value={new Date().toLocaleDateString()}
                                            disabled
                                            style={{ opacity: 0.6, cursor: 'not-allowed' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Line items */}
                        <div className={styles.txnPanel}>
                            <div className={styles.txnPanelHead}>
                                <span className={styles.txnPanelTitle}>Container line items</span>
                                <span style={{ fontSize: '12px', color: '#64748b' }}>
                                    {lines.length} line{lines.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                            <div className={styles.txnPanelBody}>
                                <table className={styles.txnLineTable}>
                                    <thead>
                                        <tr>
                                            <th style={{ width: '40%' }}>Container type</th>
                                            <th style={{ width: '18%' }}>Quantity</th>
                                            <th style={{ width: '18%' }}>Unit value</th>
                                            <th style={{ width: '18%' }}>Total</th>
                                            <th style={{ width: '6%' }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lines.map((line, idx) => (
                                            <tr key={idx}>
                                                <td>
                                                    <select
                                                        className={styles.txnLineSelect}
                                                        value={line.containerTypeID}
                                                        onChange={e => updateLine(idx, 'containerTypeID', e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select type…</option>
                                                        {containerTypes.map(ct => (
                                                            <option key={ct.containerTypeID} value={ct.containerTypeID}>
                                                                {ct.material} ({ct.countMethod})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td>
                                                    <input
                                                        className={styles.txnLineInput}
                                                        type="number"
                                                        min="1"
                                                        placeholder="0"
                                                        value={line.quantity}
                                                        onChange={e => updateLine(idx, 'quantity', e.target.value)}
                                                        required
                                                    />
                                                </td>
                                                <td>
                                                    <span className={styles.txnUnitValue}>
                                                        ${line.unitValue.toFixed(2)}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span style={{ fontWeight: 600, color: '#0f172a' }}>
                                                        ${line.value.toFixed(2)}
                                                    </span>
                                                </td>
                                                <td>
                                                    {lines.length > 1 && (
                                                        <button
                                                            type="button"
                                                            className={styles.txnRemoveBtn}
                                                            onClick={() => removeLine(idx)}
                                                        >
                                                            ×
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <button
                                    type="button"
                                    className={styles.txnAddLineBtn}
                                    onClick={addLine}
                                >
                                    + Add line item
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── Right: summary ── */}
                    <div className={styles.txnPanel} style={{ position: 'sticky', top: '72px' }}>
                        <div className={styles.txnPanelHead}>
                            <span className={styles.txnPanelTitle}>Payout summary</span>
                        </div>
                        <div className={styles.txnPanelBody}>
                            {lines.map((line, idx) => {
                                const ct = containerTypes.find(c => c.containerTypeID === parseInt(line.containerTypeID));
                                if (!ct) return null;
                                return (
                                    <div key={idx} className={styles.txnSummaryRow}>
                                        <span className={styles.txnSummaryLabel}>
                                            {ct.material} × {line.quantity || 0}
                                        </span>
                                        <span className={styles.txnSummaryValue}>
                                            ${(line.value || 0).toFixed(2)}
                                        </span>
                                    </div>
                                );
                            })}

                            <div className={styles.txnSummaryRow}>
                                <span className={styles.txnSummaryLabel}>Total containers</span>
                                <span className={styles.txnSummaryValue}>{totalContainers}</span>
                            </div>

                            <div className={styles.txnSummaryTotal}>
                                <span className={styles.txnSummaryTotalLabel}>Total payout</span>
                                <span className={styles.txnSummaryTotalValue}>${total.toFixed(2)}</span>
                            </div>

                            <button
                                type="submit"
                                className={styles.txnSubmitBtn}
                                disabled={loading || !todayRecord}
                            >
                                {loading ? 'Processing…' : 'Complete transaction'}
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                style={{
                                    width: '100%', padding: '10px', marginTop: '8px',
                                    background: 'none', border: '1px solid #e2e8f0',
                                    borderRadius: '8px', fontSize: '13px', color: '#64748b',
                                    cursor: 'pointer', fontFamily: 'inherit',
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
