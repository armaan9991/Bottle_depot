import { useState, useEffect } from 'react';
// import { getTodayRecord, closeRecord } from '../../api/dailyrecords';
import styles from './DailyRecord.module.css';
import { useParams } from 'react-router-dom';
import { getTodayRecord, getRecordById,getRecordByDate, closeRecord } from '../../api/dailyrecords';

export default function DailyRecord() {
    const [record,  setRecord]  = useState(null);
    const [error,   setError]   = useState('');
    const [loading, setLoading] = useState(false);
    const [initial, setInitial] = useState(true);
const { date } = useParams();
useEffect(() => {
    load();
}, [date]);
   const load = async () => {
    setError('');
    try {
        const res =date
            ? await getRecordByDate(date)
            : await getTodayRecord();

        setRecord(res.data);
    } catch (err) {
        const msg = err?.response?.data?.message;
        setRecord(null);
        setError(msg || 'No daily record found.');
    } finally {
        setInitial(false);
    }
};

    const handleClose = async () => {
        if (!window.confirm("Close today's record? This cannot be undone.")) return;
        setLoading(true);
        setError('');
        try {
            // Controller: POST /api/DailyRecord/close  [FromBody] int recordId
            await closeRecord(record.recordID);
            await load();
        } catch (err) {
            const msg = err?.response?.data?.message;
            setError(msg || 'Failed to close the daily record.');
        } finally {
            setLoading(false);
        }
    };

    if (initial) {
        return (
            <div className={styles.drPage}>
                <p className={styles.drLoading}>Loading daily record…</p>
            </div>
        );
    }

    if (!record) {
        return (
            <div className={styles.drPage}>
                <p className={styles.drLoading}>{error}</p>
            </div>
        );
    }

    const isOpen = record.status === 'Open';

    return (
        <div className={styles.drPage}>

            {/* ── Header ── */}
            <div className={styles.drHeader}>
                <div>
                    <h2 className={styles.drTitle}>Daily record</h2>
                    <p className={styles.drSubtitle}>
                        {new Date(record.recordDate).toLocaleDateString('en-CA', {
                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                        })}
                        {' · '}Logged by {record.employeeName}
                    </p>
                </div>
                <span className={`${styles.drStatusBadge} ${isOpen ? styles.drStatusOpen : styles.drStatusClosed}`}>
                    {record.status}
                </span>
            </div>

            {error && <p className={styles.drError}>{error}</p>}

            {/* ── Stats ── */}
            <div className={styles.drStatsGrid}>
                <div className={styles.drStatCard}>
                    <div className={styles.drStatLabel}>Total transactions</div>
                    <div className={styles.drStatValue}>{record.totalTransactions}</div>
                </div>
                <div className={styles.drStatCard}>
                    <div className={styles.drStatLabel}>Total paid out</div>
                    <div className={styles.drStatValue}>${record.totalValuePaidOut?.toFixed(2)}</div>
                </div>
                <div className={styles.drStatCard}>
                    <div className={styles.drStatLabel}>Total containers</div>
                    <div className={styles.drStatValue}>{record.totalContainers?.toLocaleString()}</div>
                </div>
                <div className={styles.drStatCard}>
                    <div className={styles.drStatLabel}>Total shipments</div>
                    <div className={styles.drStatValue}>{record.totalShipments}</div>
                </div>
            </div>

            {/* ── Detail panel ── */}
            <div className={styles.drPanel}>
                <div className={styles.drInfoGrid}>
                    <div className={styles.drInfoRow}>
                        <span className={styles.drInfoLabel}>Record ID</span>
                        <span className={styles.drInfoValue}>#{record.recordID}</span>
                    </div>
                    <div className={styles.drInfoRow}>
                        <span className={styles.drInfoLabel}>Status</span>
                        <span className={styles.drInfoValue}>{record.status}</span>
                    </div>
                    <div className={styles.drInfoRow}>
                        <span className={styles.drInfoLabel}>Logged by</span>
                        <span className={styles.drInfoValue}>{record.employeeName}</span>
                    </div>
                    <div className={styles.drInfoRow}>
                        <span className={styles.drInfoLabel}>Date</span>
                        <span className={styles.drInfoValue}>
                            {new Date(record.recordDate).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {isOpen ? (
                    <>
                        <div className={styles.drWarningBox}>
                            Closing this record will lock all transactions for today.
                            Once closed, no new transactions can be added to this record.
                            This action cannot be undone.
                        </div>
                        <button
                            className={styles.drCloseBtn}
                            onClick={handleClose}
                            disabled={loading}
                        >
                            {loading ? 'Closing…' : 'Close daily record'}
                        </button>
                    </>
                ) : (
                    <div className={styles.drLockedBox}>
                        This record is closed and locked. All transactions for this day are finalized.
                    </div>
                )}
            </div>

        </div>
    );
}
