import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllShipments, createShipment, getAllCompanies } from '../../api/shipments';
import { getTodayRecord } from '../../api/dailyrecords';
import styles from './ManageShipments.module.css';

const EMPTY_FORM = { companyID: '' };

export default function ManageShipments() {
    const { user }                        = useAuth();
    const [shipments,   setShipments]     = useState([]);
    const [companies,   setCompanies]     = useState([]);
    const [showForm,    setShowForm]      = useState(false);
    const [todayRecord, setTodayRecord]   = useState(null);
    const [form,        setForm]          = useState(EMPTY_FORM);
    const [error,       setError]         = useState('');
    const [success,     setSuccess]       = useState('');
    const [saving,      setSaving]        = useState(false);
    const [loading,     setLoading]       = useState(true);

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        setError('');

        // Shipments
        try {
            const shRes = await getAllShipments();
            setShipments(shRes.data);
        } catch {
            setError('Failed to load shipments.');
        }

        // Companies for dropdown
        try {
            const coRes = await getAllCompanies();
            setCompanies(coRes.data);
        } catch {
            setError('Failed to load companies.');
        }

        // Today's record — missing record is not fatal
        try {
            const recRes = await getTodayRecord();
            setTodayRecord(recRes.data);
        } catch {
            setTodayRecord(null);
        }

        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!todayRecord)    return setError('No open daily record found for today.');
        if (!form.companyID) return setError('Please select a company.');
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            await createShipment({
                companyID: parseInt(form.companyID, 10),
                workID:    user.workId,
                recordID:  todayRecord.recordID,
            });
            setSuccess('Shipment created successfully!');
            setShowForm(false);
            setForm(EMPTY_FORM);
            await load();
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to create shipment.');
        } finally {
            setSaving(false);
        }
    };

    const openForm = () => {
        setShowForm(true);
        setError('');
        setSuccess('');
    };

    const cancelForm = () => {
        setShowForm(false);
        setForm(EMPTY_FORM);
        setError('');
    };

    const recordIsOpen = todayRecord?.status === 'Open';

    return (
        <div className={styles.shipPage}>

            {/* ── Header ── */}
            <div className={styles.shipHeader}>
                <div>
                    <h2 className={styles.shipTitle}>Shipments</h2>
                    <p className={styles.shipSubtitle}>
                        {loading ? '…' : `${shipments.length} total shipments`}
                    </p>
                </div>
                <button className={styles.shipNewBtn} onClick={showForm ? cancelForm : openForm}>
                    {showForm ? 'Cancel' : '+ New shipment'}
                </button>
            </div>

            {error   && <p className={styles.shipError}>{error}</p>}
            {success && <p className={styles.shipSuccess}>{success}</p>}

            {/* ── New shipment form ── */}
            {showForm && (
                <div className={styles.shipFormWrap}>
                    <div className={styles.shipFormHead}>
                        <span className={styles.shipFormHeadTitle}>New shipment</span>
                        <button className={styles.shipCancelBtn} onClick={cancelForm}>×</button>
                    </div>

                    <div className={styles.shipFormBody}>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.shipFormGrid}>

                                {/* Company dropdown */}
                                <div className={styles.shipFormField}>
                                    <label htmlFor="companyID">Company</label>
                                    <select
                                        id="companyID"
                                        value={form.companyID}
                                        onChange={e => setForm({ companyID: e.target.value })}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '8px 10px',
                                            borderRadius: '8px',
                                            border: '1px solid #e2e8f0',
                                            fontSize: '13px',
                                            fontFamily: 'inherit',
                                            background: '#fff',
                                            color: '#0f172a',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <option value="">— Select a company —</option>
                                        {companies.map(c => (
                                            <option key={c.companyID} value={c.companyID}>
                                                {c.companyName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Processed by (read-only) */}
                                <div className={styles.shipFormField}>
                                    <label>Processed by</label>
                                    <input
                                        value={user?.name || ''}
                                        disabled
                                        readOnly
                                        style={{ opacity: 0.6 }}
                                    />
                                </div>

                                {/* Daily record (read-only) */}
                                <div className={styles.shipFormField}>
                                    <label>Daily record</label>
                                    <input
                                        value={
                                            todayRecord
                                                ? `#${todayRecord.recordID} — ${todayRecord.status}`
                                                : 'No open record found for today'
                                        }
                                        disabled
                                        readOnly
                                        style={{ opacity: 0.6 }}
                                    />
                                </div>

                            </div>

                            {/* Warn if record is closed */}
                            {todayRecord && !recordIsOpen && (
                                <p className={styles.shipError} style={{ marginBottom: '12px' }}>
                                    Today&apos;s record is closed. New shipments cannot be added.
                                </p>
                            )}

                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    onClick={cancelForm}
                                    style={{
                                        padding: '9px 16px',
                                        background: 'none',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        color: '#64748b',
                                        cursor: 'pointer',
                                        fontFamily: 'inherit',
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={styles.shipCreateBtn}
                                    type="submit"
                                    disabled={saving || !todayRecord || !recordIsOpen}
                                >
                                    {saving ? 'Creating…' : 'Create shipment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Table ── */}
            <div className={styles.shipTablePanel}>
                {loading ? (
                    <p style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                        Loading shipments…
                    </p>
                ) : (
                    <table className={styles.shipTable}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Company</th>
                                <th>Total bags</th>
                                <th>Total value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shipments.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className={styles.shipEmpty}>No shipments yet</td>
                                </tr>
                            ) : (
                                shipments.map(s => (
                                    <tr key={s.shipmentID}>
                                        <td><span className={styles.shipIdBadge}>#{s.shipmentID}</span></td>
                                        <td className={styles.shipMuted}>
                                            {new Date(s.shipmentDate).toLocaleDateString()}
                                        </td>
                                        <td>{s.companyName}</td>
                                        <td className={styles.shipMuted}>{s.totalBags} bags</td>
                                        <td className={styles.shipMoney}>${s.totalValue?.toFixed(2)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
