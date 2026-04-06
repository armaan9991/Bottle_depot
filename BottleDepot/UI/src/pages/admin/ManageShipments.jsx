import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllShipments, createShipment } from '../../api/shipments';
// import { getTodayRecord } from '../../api/dailyRecords';
import styles from './ManageShipments.module.css';

const EMPTY_FORM = { companyID: '' };

export default function ManageShipments() {
    const { user }                      = useAuth();
    const [shipments,   setShipments]   = useState([]);
    const [showForm,    setShowForm]    = useState(false);
    const [todayRecord, setTodayRecord] = useState(null);
    const [form,        setForm]        = useState(EMPTY_FORM);
    const [error,       setError]       = useState('');
    const [success,     setSuccess]     = useState('');
    const [saving,      setSaving]      = useState(false);

    useEffect(() => { load(); }, []);

    const load = async () => {
        try {
            const [shRes, recRes] = await Promise.all([
                getAllShipments(),
                getTodayRecord(),
            ]);
            setShipments(shRes.data);
            setTodayRecord(recRes.data);
        } catch { setError('Failed to load shipments'); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!todayRecord) return setError('No open daily record found for today.');
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            await createShipment({
                companyID: parseInt(form.companyID),
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

    return (
        <div className={styles.shipPage}>
            <div className={styles.shipHeader}>
                <div>
                    <h2 className={styles.shipTitle}>Shipments</h2>
                    <p className={styles.shipSubtitle}>{shipments.length} total shipments</p>
                </div>
                <button className={styles.shipNewBtn} onClick={() => { setShowForm(!showForm); setError(''); }}>
                    {showForm ? 'Cancel' : '+ New shipment'}
                </button>
            </div>

            {error   && <p className={styles.shipError}>{error}</p>}
            {success && <p className={styles.shipSuccess}>{success}</p>}

            {/* ── Form ── */}
            {showForm && (
                <div className={styles.shipFormWrap}>
                    <div className={styles.shipFormHead}>
                        <span className={styles.shipFormHeadTitle}>New shipment</span>
                        <button className={styles.shipCancelBtn} onClick={() => setShowForm(false)}>×</button>
                    </div>
                    <div className={styles.shipFormBody}>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.shipFormGrid}>
                                <div className={styles.shipFormField}>
                                    <label>Company ID</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 1"
                                        value={form.companyID}
                                        onChange={e => setForm({ companyID: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className={styles.shipFormField}>
                                    <label>Processed by</label>
                                    <input value={user?.name || ''} disabled style={{ opacity: 0.6 }} />
                                </div>
                                <div className={styles.shipFormField}>
                                    <label>Daily record</label>
                                    <input
                                        value={todayRecord ? `#${todayRecord.recordID} — today` : 'No record found'}
                                        disabled
                                        style={{ opacity: 0.6 }}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    style={{ padding: '9px 16px', background: 'none', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', color: '#64748b', cursor: 'pointer', fontFamily: 'inherit' }}
                                >
                                    Cancel
                                </button>
                                <button className={styles.shipCreateBtn} type="submit" disabled={saving || !todayRecord}>
                                    {saving ? 'Creating…' : 'Create shipment'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Table ── */}
            <div className={styles.shipTablePanel}>
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
            </div>
        </div>
    );
}
