// src/pages/admin/Reports.jsx
import { useState, useEffect } from 'react';
import { getAllRecords } from '../../api/dailyrecords';
import { getAllShipments } from '../../api/shipments';
import styles from './Reports.module.css';

export default function Reports() {
    const [records,   setRecords]   = useState([]);
    const [shipments, setShipments] = useState([]);
    const [error,     setError]     = useState('');

    useEffect(() => {
        Promise.all([getAllRecords(), getAllShipments()])
            .then(([r, s]) => {
                // 1. Log the raw data so we can see exactly what the API is giving us
                console.log("Raw Records Data:", r);
                console.log("Raw Shipments Data:", s);

                // 2. Only update state if it's actually an array, otherwise default to []
                setRecords(Array.isArray(r) ? r : []);
                setShipments(Array.isArray(s) ? s : []);
            })
            .catch((err) => {
                console.error(err);
                setError('Failed to load report data');
            });
    }, []);

    const totalPaidOut    = records.reduce((s, r) => s + (r.totalValuePaidOut || 0), 0);
    const totalContainers = records.reduce((s, r) => s + (r.totalContainers   || 0), 0);
    const totalTxns       = records.reduce((s, r) => s + (r.totalTransactions || 0), 0);
    const totalShipVal    = shipments.reduce((s, sh) => s + (sh.totalValue    || 0), 0);

    return (
        <div className={styles.repPage}>
            <h2 className={styles.repTitle}>Reports</h2>
            <p className={styles.repSubtitle}>All-time summary across all daily records</p>

            {error && <p className={styles.repError}>{error}</p>}

            <div className={styles.repStatsGrid}>
                <div className={styles.repStatCard}>
                    <div className={styles.repStatLabel}>Total transactions</div>
                    <div className={styles.repStatValue}>{totalTxns}</div>
                </div>
                <div className={styles.repStatCard}>
                    <div className={styles.repStatLabel}>Total paid out</div>
                    <div className={styles.repStatValue}>${totalPaidOut.toFixed(2)}</div>
                </div>
                <div className={styles.repStatCard}>
                    <div className={styles.repStatLabel}>Containers processed</div>
                    <div className={styles.repStatValue}>{totalContainers.toLocaleString()}</div>
                </div>
                <div className={styles.repStatCard}>
                    <div className={styles.repStatLabel}>Shipment value</div>
                    <div className={styles.repStatValue}>${totalShipVal.toFixed(2)}</div>
                </div>
            </div>

            <div className={styles.repGrid}>
                <div className={styles.repPanel}>
                    <div className={styles.repPanelHead}>Daily records</div>
                    <table className={styles.repTable}>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Transactions</th>
                                <th>Paid out</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.length === 0 ? (
                                <tr><td colSpan="4" className={styles.repEmpty}>No records yet</td></tr>
                            ) : records.map(r => (
                                <tr key={r.recordID}>
                                    <td className={styles.repMuted}>
                                        {new Date(r.recordDate).toLocaleDateString()}
                                    </td>
                                    <td>{r.totalTransactions}</td>
                                    <td className={styles.repMoney}>${r.totalValuePaidOut?.toFixed(2)}</td>
                                    <td>
                                        <span className={r.status === 'Open' ? styles.repStatusOpen : styles.repStatusClosed}>
                                            {r.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles.repPanel}>
                    <div className={styles.repPanelHead}>Shipments</div>
                    <table className={styles.repTable}>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Company</th>
                                <th>Bags</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shipments.length === 0 ? (
                                <tr><td colSpan="4" className={styles.repEmpty}>No shipments yet</td></tr>
                            ) : shipments.map(s => (
                                <tr key={s.shipmentID}>
                                    <td className={styles.repMuted}>
                                        {new Date(s.shipmentDate).toLocaleDateString()}
                                    </td>
                                    <td>{s.companyName}</td>
                                    <td className={styles.repMuted}>{s.totalBags}</td>
                                    <td className={styles.repMoney}>${s.totalValue?.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}