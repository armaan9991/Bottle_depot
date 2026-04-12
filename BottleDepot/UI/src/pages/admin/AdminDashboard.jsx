// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import { getAllTransactions } from '../../api/transactions';
import { getAllEmployees } from '../../api/employees';
import { getTodayRecord } from '../../api/dailyrecords';
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

            // Safely unwrap daily record
            let recordData = recRes?.data ? recRes.data : recRes;
            let recordsArray = Array.isArray(recordData) ? recordData : [recordData];

            let globalStats = { txns: 0, paid: 0, containers: 0, shipments: 0 };
            recordsArray.forEach(r => {
                if (r) {
                    globalStats.txns += (r.totalTransactions || r.totalTransaction || 0);
                    globalStats.paid += (r.totalValuePaidOut || r.totalValuePaid || r.totalValue || 0);
                    globalStats.containers += (r.totalContainers || r.totalContainer || 0);
                    globalStats.shipments += (r.totalShipments || r.totalShipment || 0);
                }
            });

            setRecord(globalStats);
            
            // Safely unwrap transactions and employees
            const txnData = txnRes?.data ? txnRes.data : txnRes;
            setTransactions(Array.isArray(txnData) ? txnData : []);
            
            const empData = empRes?.data ? empRes.data : empRes;
            setEmployees(Array.isArray(empData) ? empData : []);

        } catch (e) {
            setError('Failed to load dashboard data');
            console.error(e);
        }
    };

    // --- Filter Transactions ---
    const todayStr = new Date().toLocaleDateString();
    
    // Everything that matches today's date string
    const todaysTransactions = transactions.filter(t => 
        new Date(t.date).toLocaleDateString() === todayStr
    );
    
    // Everything else (sliced to 5 so the table doesn't get infinitely long)
    const pastTransactions = transactions.filter(t => 
        new Date(t.date).toLocaleDateString() !== todayStr
    ).slice(0, 5);

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
                        <div className={styles.dashPanelHeader}>Today's Transactions</div>
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

                    {/* Past Transactions Panel */}
                    <div className={styles.dashPanel}>
                        <div className={styles.dashPanelHeader}>Past Transactions</div>
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
                                        <tr key={t.transactionID}>
                                            <td>{t.customerName}</td>
                                            <td className={styles.dashMuted}>
                                                {new Date(t.date).toLocaleDateString()}
                                            </td>
                                            <td className={styles.dashMoney}>${t.total?.toFixed(2)}</td>
                                        </tr>
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