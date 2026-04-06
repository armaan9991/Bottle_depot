// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import { getAllTransactions } from '../../api/transactions';
import { getAllEmployees } from '../../api/employees';
// import { getTodayRecord } from '../../a  pi/dailyRecords';   
import styles from '../Dashboard.module.css';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [record, setRecord]               = useState(null);
    const [transactions, setTransactions]   = useState([]);
    const [employees, setEmployees]         = useState([]);
    const [error, setError]                 = useState('');

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [recRes, txnRes, empRes] = await Promise.all([
                getTodayRecord(),
                getAllTransactions(),
                getAllEmployees(),
            ]);
            setRecord(recRes.data);
            setTransactions(txnRes.data.slice(0, 5));
            setEmployees(empRes.data);
        } catch (e) {
            setError('Failed to load dashboard data');
            console.error(e);
        }
    };

    return (
        <div className={styles.dashPage}>
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
                        value={record.totalTransactions}
                        sub="Record open"
                        className={styles.dashStatCard}
                        labelClassName={styles.dashStatLabel}
                        valueClassName={styles.dashStatValue}
                        subClassName={styles.dashStatSub}
                    />
                    <StatCard
                        label="Total Paid Out"
                        value={`$${record.totalValuePaidOut?.toFixed(2)}`}
                        sub="Today"
                        className={styles.dashStatCard}
                        labelClassName={styles.dashStatLabel}
                        valueClassName={styles.dashStatValue}
                        subClassName={styles.dashStatSub}
                    />
                    <StatCard
                        label="Containers Processed"
                        value={record.totalContainers?.toLocaleString()}
                        sub="Today"
                        className={styles.dashStatCard}
                        labelClassName={styles.dashStatLabel}
                        valueClassName={styles.dashStatValue}
                        subClassName={styles.dashStatSub}
                    />
                    <StatCard
                        label="Shipments"
                        value={record.totalShipments}
                        sub="Today"
                        className={styles.dashStatCard}
                        labelClassName={styles.dashStatLabel}
                        valueClassName={styles.dashStatValue}
                        subClassName={styles.dashStatSub}
                    />
                </div>
            )}

            <div className={styles.dashContentGrid}>
                <div className={styles.dashPanel}>
                    <div className={styles.dashPanelHeader}>Recent Transactions</div>
                    <table className={styles.dashTable}>
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>Employee</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className={styles.dashEmpty}>
                                        No transactions yet
                                    </td>
                                </tr>
                            ) : (
                                transactions.map(t => (
                                    <tr key={t.transactionID}>
                                        <td>{t.customerName}</td>
                                        <td className={styles.dashMuted}>{t.employeeName}</td>
                                        <td className={styles.dashMoney}>${t.total?.toFixed(2)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

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
