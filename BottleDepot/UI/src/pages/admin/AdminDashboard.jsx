// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import TransactionDetailModal from '../../components/TransactionDetailModal';
import { getAllTransactions, getTransactionById } from '../../api/transactions';
import { getAllEmployees } from '../../api/employees';
import { getTodayRecord } from '../../api/dailyrecords';
import styles from '../Dashboard.module.css';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [record, setRecord]                   = useState(null);
    const [transactions, setTransactions]       = useState([]);
    const [employees, setEmployees]             = useState([]);
    const [error, setError]                     = useState('');

    // Modal state
    const [selectedTxn, setSelectedTxn]         = useState(null);   // full detail object
    const [loadingTxnId, setLoadingTxnId]       = useState(null);   // shows spinner on row

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [recRes, txnRes, empRes] = await Promise.all([
                getTodayRecord(),
                getAllTransactions(),
                getAllEmployees(),
            ]);

            let recordData   = recRes?.data ? recRes.data : recRes;
            let recordsArray = Array.isArray(recordData) ? recordData : [recordData];

            let globalStats = { txns: 0, paid: 0, containers: 0, shipments: 0 };
            recordsArray.forEach(r => {
                if (r) {
                    globalStats.txns       += (r.totalTransactions || r.totalTransaction || 0);
                    globalStats.paid       += (r.totalValuePaidOut || r.totalValuePaid || r.totalValue || 0);
                    globalStats.containers += (r.totalContainers || r.totalContainer || 0);
                    globalStats.shipments  += (r.totalShipments || r.totalShipment || 0);
                }
            });

            setRecord(globalStats);

            const txnData = txnRes?.data ? txnRes.data : txnRes;
            setTransactions(Array.isArray(txnData) ? txnData : []);

            const empData = empRes?.data ? empRes.data : empRes;
            setEmployees(Array.isArray(empData) ? empData : []);

        } catch (e) {
            setError('Failed to load dashboard data');
            console.error(e);
        }
    };

    // ── Open modal: fetch full detail for clicked transaction ──
    const handleTxnClick = useCallback(async (txnId) => {
        if (loadingTxnId) return;           // prevent double-click while loading
        setLoadingTxnId(txnId);
        try {
            const data = await getTransactionById(txnId);
            // Unwrap if needed
            setSelectedTxn(data?.data ? data.data : data);
        } catch (e) {
            console.error('Failed to load transaction detail:', e);
            setError('Could not load transaction details. Please try again.');
        } finally {
            setLoadingTxnId(null);
        }
    }, [loadingTxnId]);

    const handleCloseModal = useCallback(() => setSelectedTxn(null), []);

    // ── Filter Transactions ──
    const todayStr = new Date().toLocaleDateString();

    const todaysTransactions = transactions.filter(t =>
        new Date(t.date).toLocaleDateString() === todayStr
    );

    const pastTransactions = transactions.filter(t =>
        new Date(t.date).toLocaleDateString() !== todayStr
    ).slice(0, 5);

    // ── Shared clickable row renderer ──
    const TxnRow = ({ t, showDate = false }) => {
        const isLoading = loadingTxnId === t.transactionID;
        return (
            <tr
                key={t.transactionID}
                onClick={() => handleTxnClick(t.transactionID)}
                className={styles.dashClickableRow}
                title="Click to view details"
                style={{ cursor: isLoading ? 'wait' : 'pointer' }}
            >
                <td>{t.customerName}</td>
                {showDate
                    ? <td className={styles.dashMuted}>{new Date(t.date).toLocaleDateString()}</td>
                    : <td className={styles.dashMuted}>{t.employeeName}</td>
                }
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

            <div className={styles.dashHeader}>
                <div>
                    <h2 className={styles.dashTitle}>Admin Dashboard</h2>
                    <p className={styles.dashSubtitle}>
                        Welcome back, <span>{user?.name}</span>
                    </p>
                </div>
                <span className={styles.dashBadge}>Admin</span>
            </div>

            {error && <p className={styles.dashError}>{error}</p>}

            {record && (
                <div className={styles.dashStatsGrid}>
                    <StatCard
                        label="Transactions Today"
                        value={record.txns}
                        sub="Record open"
                        className={styles.dashStatCard}
                        labelClassName={styles.dashStatLabel}
                        valueClassName={styles.dashStatValue}
                        subClassName={styles.dashStatSub}
                    />
                    <StatCard
                        label="Total Paid Out"
                        value={`$${record.paid.toFixed(2)}`}
                        sub="Today"
                        className={styles.dashStatCard}
                        labelClassName={styles.dashStatLabel}
                        valueClassName={styles.dashStatValue}
                        subClassName={styles.dashStatSub}
                    />
                    <StatCard
                        label="Containers Processed"
                        value={record.containers.toLocaleString()}
                        sub="Today"
                        className={styles.dashStatCard}
                        labelClassName={styles.dashStatLabel}
                        valueClassName={styles.dashStatValue}
                        subClassName={styles.dashStatSub}
                    />
                    <StatCard
                        label="Shipments"
                        value={record.shipments}
                        sub="Today"
                        className={styles.dashStatCard}
                        labelClassName={styles.dashStatLabel}
                        valueClassName={styles.dashStatValue}
                        subClassName={styles.dashStatSub}
                    />
                </div>
            )}

            <div className={styles.dashContentGrid}>

                {/* Left Column: Two Transaction Tables Stacked */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Today's Transactions Panel */}
                    <div className={styles.dashPanel}>
                        <div className={styles.dashPanelHeader}>
                            Today's Transactions
                        </div>
                        <table className={styles.dashTable}>
                            <thead>
                                <tr>
                                    <th>Customer</th>
                                    <th>Employee</th>
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

                    {/* Past Transactions Panel */}
                    <div className={styles.dashPanel}>
                        <div className={styles.dashPanelHeader}>
                            Past Transactions
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

                {/* Right Column: Employees */}
                <div className={styles.dashPanel}>
                    <div className={styles.dashPanelHeader}>Employees</div>
                    <div className={styles.dashEmpList}>
                        {employees.map(emp => (
                            <div key={emp.workID} className={styles.dashEmpRow}>
                                <div className={styles.dashAvatar}>
                                    {emp.name?.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className={styles.dashEmpInfo}>
                                    <div className={styles.dashEmpName}>{emp.name}</div>
                                    <div className={styles.dashEmpRole}>{emp.role}</div>
                                </div>
                                <StatusBadge
                                    status={emp.role}
                                    className={`${styles.dashStatusBadge} ${emp.role === 'Admin' ? styles.dashRoleAdmin : styles.dashRoleEmployee}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
