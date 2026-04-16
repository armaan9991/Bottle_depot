// src/pages/employee/EmployeeDashboard.jsx
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import TransactionDetailModal from '../../components/TransactionDetailModal';
import { getTransactionsByEmployee, getTransactionById } from '../../api/transactions';
import styles from '../Dashboard.module.css';
import { useNavigate } from 'react-router-dom';

export default function EmployeeDashboard() {
    const { user } = useAuth();
    const [transactions, setTransactions]   = useState([]);
    const [error, setError]                 = useState('');
    const [selectedTxn, setSelectedTxn]     = useState(null);
    const [loadingTxnId, setLoadingTxnId]   = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (user?.workId) {
            getTransactionsByEmployee(user.workId)
                .then(res => {
                    const data = res?.data ? res.data : res;
                    setTransactions(Array.isArray(data) ? data : []);
                })
                .catch(() => setError('Failed to load transactions'));
        }
    }, [user]);

    // ── Modal handlers ──
    const handleTxnClick = useCallback(async (txnId) => {
        if (loadingTxnId) return;
        setLoadingTxnId(txnId);
        try {
            const data = await getTransactionById(txnId);
            setSelectedTxn(data?.data ? data.data : data);
        } catch (e) {
            console.error('Failed to load transaction detail:', e);
            setError('Could not load transaction details. Please try again.');
        } finally {
            setLoadingTxnId(null);
        }
    }, [loadingTxnId]);

    const handleCloseModal = useCallback(() => setSelectedTxn(null), []);

    // ── Derived data ──
    const todayStr = new Date().toLocaleDateString();

    const todaysTransactions = transactions.filter(t =>
        new Date(t.date).toLocaleDateString() === todayStr
    );

    const pastTransactions = transactions.filter(t =>
        new Date(t.date).toLocaleDateString() !== todayStr
    ).slice(0, 5);

    const totalContainers = todaysTransactions.reduce((s, t) => s + (t.totalContainers ?? 0), 0);
    const totalPaidOut    = todaysTransactions.reduce((s, t) => s + (t.total ?? 0), 0);

    // ── Shared clickable row ──
    const TxnRow = ({ t, showDate = false }) => {
        const isLoading = loadingTxnId === t.transactionID;
        return (
            <tr
                onClick={() => handleTxnClick(t.transactionID)}
                className={styles.dashClickableRow}
                title="Click to view details"
                style={{ cursor: isLoading ? 'wait' : 'pointer' }}
            >
                <td>{t.customerName}</td>
                <td className={styles.dashMuted}>
                    {showDate
                        ? new Date(t.date).toLocaleDateString()
                        : t.totalContainers?.toLocaleString()
                    }
                </td>
                <td className={styles.dashMoney}>
                    {isLoading
                        ? <span className={styles.dashLoadingDot}>…</span>
                        : `$${t.total?.toFixed(2)}`
                    }
                </td>
            </tr>
        );
    };

    return (
        <div className={styles.dashPage}>

            {/* Detail Modal */}
            {selectedTxn && (
                <TransactionDetailModal
                    transaction={selectedTxn}
                    onClose={handleCloseModal}
                />
            )}

            {/* ── Header ── */}
            <div className={styles.dashHeader}>
                <div>
                    <h2 className={styles.dashTitle}>My Dashboard</h2>
                    <p className={styles.dashSubtitle}>
                        Welcome back, <span>{user?.name}</span>
                    </p>
                </div>
                <span className={styles.dashBadge}>Employee</span>
            </div>

            {error && <p className={styles.dashError}>{error}</p>}

            {/* ── Stat Cards ── */}
            <div className={styles.dashStatsGrid}>
                <StatCard
                    label="My Transactions"
                    value={todaysTransactions.length}
                    sub="Today"
                    className={styles.dashStatCard}
                    labelClassName={styles.dashStatLabel}
                    valueClassName={styles.dashStatValue}
                    subClassName={styles.dashStatSub}
                />
                <StatCard
                    label="Containers Processed"
                    value={totalContainers.toLocaleString()}
                    sub="Today"
                    className={styles.dashStatCard}
                    labelClassName={styles.dashStatLabel}
                    valueClassName={styles.dashStatValue}
                    subClassName={styles.dashStatSub}
                />
                <StatCard
                    label="Total Paid Out"
                    value={`$${totalPaidOut.toFixed(2)}`}
                    sub="Today"
                    className={styles.dashStatCard}
                    labelClassName={styles.dashStatLabel}
                    valueClassName={styles.dashStatValue}
                    subClassName={styles.dashStatSub}
                />
            </div>

            <div className={styles.dashContentGrid}>

                {/* Left Column: Two Transaction Tables Stacked */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Today's Transactions */}
                    <div className={styles.dashPanel}>
                        <div className={styles.dashPanelHeader}>
                            Today's Transactions
                            {/* <span className={styles.dashPanelHint}>Click a row for details</span> */}
                        </div>
                        <table className={styles.dashTable}>
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>Containers</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {todaysTransactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className={styles.dashEmpty}>
                                            No transactions today
                                        </td>
                                    </tr>
                                ) : (
                                    todaysTransactions.map(t => (
                                        <TxnRow key={t.transactionID} t={t} showDate={false} />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Past Transactions */}
                    <div className={styles.dashPanel}>
                        <div className={styles.dashPanelHeader}>
                            Past Transactions
                            {/* <span className={styles.dashPanelHint}>Click a row for details</span> */}
                        </div>
                        <table className={styles.dashTable}>
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>Date</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pastTransactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className={styles.dashEmpty}>
                                            No past transactions
                                        </td>
                                    </tr>
                                ) : (
                                    pastTransactions.map(t => (
                                        <TxnRow key={t.transactionID} t={t} showDate={true} />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column: New Transaction CTA */}
                <div className={styles.dashPanel} style={{ alignSelf: 'flex-start' }}>
                    <div className={styles.dashPanelHeader}>Quick Actions</div>
                    <div style={{ padding: '16px' }}>
                        <button
                            onClick={() => navigate('/transaction/new')}
                            className={styles.dashNewTxnBtn}
                        >
                            + New Transaction
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
