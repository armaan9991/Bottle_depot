// EmployeeDashboard.jsx  —  wire in Dashboard.module.css
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import { getTransactionsByEmployee } from '../../api/transactions';
import styles from '../Dashboard.module.css';
import { Navigate, useNavigate } from 'react-router-dom';

export default function EmployeeDashboard() {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    
    useEffect(() => {
        if (user?.workId) {
            getTransactionsByEmployee(user.workId)
                .then(res => setTransactions(res))
                .catch(() => setError('Failed to load transactions'));
        }
    }, [user]);

    // --- THE FIX ---
    // 1. Get today's date string in the same format your table uses
    const todayStr = new Date().toLocaleDateString();

    // 2. Filter the data to only include transactions from today
    const todaysTransactions = transactions.filter(t => 
        new Date(t.date).toLocaleDateString() === todayStr
    );

    // 3. Do the math using ONLY today's transactions
    const totalContainers = todaysTransactions.reduce((s, t) => s + t.totalContainers, 0);
    const totalPaidOut    = todaysTransactions.reduce((s, t) => s + t.total, 0);

    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.pageHeader}>
                <div>
                    <h2 className={styles.pageTitle}>My Dashboard</h2>
                    <p className={styles.pageSubtitle}>
                        Welcome back, <span>{user?.name}</span>
                    </p>
                </div>
                <span className={styles.badge}>Employee</span>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            {/* Stat cards */}
            <div className={styles.statsGrid}>
                <button onClick={() => navigate('/transaction/new')}>
                + New transaction
                </button>
                <StatCard
                    label="My Transactions"
                    value={todaysTransactions.length} 
                    sub="Today"
                    className={styles.statCard}
                    labelClassName={styles.statLabel}
                    valueClassName={styles.statValue}
                    subClassName={styles.statSub}
                />
                <StatCard
                    label="Containers"
                    value={totalContainers.toLocaleString()}
                    sub="Processed Today" 
                    className={styles.statCard}
                    labelClassName={styles.statLabel}
                    valueClassName={styles.statValue}
                    subClassName={styles.statSub}
                />
                <StatCard
                    label="Total Paid Out"
                    value={`$${totalPaidOut.toFixed(2)}`}
                    sub="Today" 
                    className={styles.statCard}
                    labelClassName={styles.statLabel}
                    valueClassName={styles.statValue}
                    subClassName={styles.statSub}
                />
            </div>

            {/* Transactions table - Keeps using the full 'transactions' array to show history */}
            <div className={styles.panel}>
                <div className={styles.panelHeader}>Recent Transactions</div>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Containers</th>
                            <th>Total</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan="4" className={styles.empty}>
                                    No transactions yet
                                </td>
                            </tr>
                        ) : (
                            transactions.map(t => (
                                <tr key={t.transactionID}>
                                    <td>{t.customerName}</td>
                                    <td className={styles.muted}>{t.totalContainers}</td>
                                    <td className={styles.money}>${t.total?.toFixed(2)}</td>
                                    <td className={styles.muted}>
                                        {new Date(t.date).toLocaleDateString()}
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