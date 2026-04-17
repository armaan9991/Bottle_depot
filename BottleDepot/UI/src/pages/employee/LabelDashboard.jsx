import { useState, useEffect } from 'react';
import { createLabel, getAllLabels, processLabel } from '../../api/Label';
import { getAllShipments } from '../../api/shipments';
import { getAllTransactions } from '../../api/transactions';
import { useAuth } from '../../context/AuthContext';
import styles from './LabelDashboard.module.css';

export default function LabelDashboard() {
    const { user } = useAuth();

    const [labels,       setLabels]       = useState([]);
    const [shipments,    setShipments]    = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [form,    setForm]    = useState({ transactionID: '', shipmentID: '', weight: '' });
    const [error,   setError]   = useState('');
    const [loading, setLoading] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const res = await getAllLabels();
            setLabels(Array.isArray(res.data) ? res.data : []);
        } catch {
            setError('Failed to load labels');
        } finally {
            setLoading(false);
        }
    };

    const loadFormData = async () => {
        try {
            const [shipmentsRes, txRes] = await Promise.all([
                getAllShipments(),
                getAllTransactions()
            ]);
            setShipments(Array.isArray(shipmentsRes.data) ? shipmentsRes.data : []);
            setTransactions(Array.isArray(txRes) ? txRes : []);
        } catch (err) {
            console.error('Failed to load form dropdowns', err);
        }
    };

    useEffect(() => {
        load();
        loadFormData();
    }, []);

    // When transaction is selected, auto-fill weight from totalContainers
    const handleTransactionChange = (e) => {
        const selectedID = e.target.value;
        const selectedTx = transactions.find(t => t.transactionID === parseInt(selectedID));
        setForm({
            ...form,
            transactionID: selectedID,
            weight: selectedTx ? selectedTx.totalContainers.toString() : ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.transactionID || !form.weight) {
            setError('Transaction and Container Count are required');
            return;
        }

        const rawShipment = parseInt(form.shipmentID);

        try {
            await createLabel({
                workID:        user.workId,
                transactionID: parseInt(form.transactionID),
                shipmentID:    isNaN(rawShipment) ? null : rawShipment,
                weight:        parseFloat(form.weight)
            });
            setForm({ transactionID: '', shipmentID: '', weight: '' });
            load();
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to create label');
        }
    };

    const handleProcess = async (id) => {
        try {
            await processLabel(id);
            load();
        } catch {
            setError('Failed to update label');
        }
    };

    return (
        <div className={styles.page}>
            <h2 className={styles.title}>Label Management</h2>

            {error && <p className={styles.error}>{error}</p>}

            {/* FORM */}
            <div className={styles.formCard}>
                <h3>Create Label</h3>

                <form onSubmit={handleSubmit} className={styles.form}>

                    <select
                        value={form.transactionID}
                        onChange={handleTransactionChange}
                        className={styles.select}
                        required
                    >
                        <option value="">— Select transaction —</option>
                        {transactions.map(t => (
                            <option key={t.transactionID} value={t.transactionID}>
                                #{t.transactionID} — ${t.total?.toFixed(2)} · {t.totalContainers} containers ({new Date(t.date).toLocaleDateString()})
                            </option>
                        ))}
                    </select>

                    <select
                        value={form.shipmentID}
                        onChange={e => setForm({ ...form, shipmentID: e.target.value })}
                        className={styles.select}
                    >
                        <option value="">No shipment (optional)</option>
                        {shipments.map(s => (
                            <option key={s.shipmentID} value={s.shipmentID}>
                                #{s.shipmentID} — {s.companyName} ({new Date(s.shipmentDate).toLocaleDateString()})
                            </option>
                        ))}
                    </select>

                    {/* Container count — auto-filled from selected transaction */}
                    <input
                        type="number"
                        placeholder="Container count"
                        value={form.weight}
                        onChange={e => setForm({ ...form, weight: e.target.value })}
                        min="1"
                        title="Auto-filled from selected transaction, editable if needed"
                    />

                    <button type="submit">Create Label</button>
                </form>
            </div>

            {/* TABLE */}
            <div className={styles.tableCard}>
                <h3>All Labels</h3>

                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Transaction</th>
                            <th>Shipment</th>
                            <th>Containers</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="7" className={styles.empty}>Loading…</td>
                            </tr>
                        ) : labels.length === 0 ? (
                            <tr>
                                <td colSpan="7" className={styles.empty}>No labels found</td>
                            </tr>
                        ) : (
                            labels.map(l => (
                                <tr key={l.labelID}>
                                    <td>{l.labelID}</td>
                                    <td>#{l.transactionID}</td>
                                    <td>{l.shipmentID ? `#${l.shipmentID}` : '—'}</td>
                                    <td>{l.weight}</td>
                                    <td>
                                        <span className={l.status === 'Pending' ? styles.pending : styles.processed}>
                                            {l.status}
                                        </span>
                                    </td>
                                    <td>{new Date(l.tagDate).toLocaleDateString()}</td>
                                    <td>
                                        {l.status === 'Pending' && (
                                            <button
                                                onClick={() => handleProcess(l.labelID)}
                                                className={styles.processBtn}
                                            >
                                                Process
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}