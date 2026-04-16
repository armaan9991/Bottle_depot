// src/components/TransactionDetailModal.jsx
import { useEffect, useRef } from 'react';
import styles from "./TransactionDetailModal.module.css"

export default function TransactionDetailModal({ transaction, onClose }) {
    const overlayRef = useRef(null);

    // Close on Escape key
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [onClose]);

    // Close on backdrop click
    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) onClose();
    };

    if (!transaction) return null;

    return (
        <div
            className={styles.overlay}
            ref={overlayRef}
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
            aria-label="Transaction Details"
        >
            <div className={styles.modal}>

                {/* ── Header ── */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        {/* <span className={styles.txnId}>TXN #{transaction.transactionID}</span> */}
                        <h2 className={styles.title}>Transaction Details</h2>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                        ✕
                    </button>
                </div>

                {/* ── Meta Info ── */}
                <div className={styles.metaGrid}>
                    <div className={styles.metaCard}>
                        <span className={styles.metaLabel}>Customer</span>
                        <span className={styles.metaValue}>{transaction.customerName}</span>
                    </div>
                    <div className={styles.metaCard}>
                        <span className={styles.metaLabel}>Employee</span>
                        <span className={styles.metaValue}>{transaction.employeeName}</span>
                    </div>
                    <div className={styles.metaCard}>
                        <span className={styles.metaLabel}>Date</span>
                        <span className={styles.metaValue}>
                            {new Date(transaction.date).toLocaleDateString('en-CA', {
                                year: 'numeric', month: 'short', day: 'numeric'
                            })}
                        </span>
                    </div>
                    <div className={`${styles.metaCard} ${styles.metaCardAccent}`}>
                        <span className={styles.metaLabel}>Total Paid Out</span>
                        <span className={styles.metaValueLarge}>${transaction.total?.toFixed(2)}</span>
                    </div>
                </div>

                {/* ── Line Items ── */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionTitle}>Container Breakdown</span>
                        <span className={styles.containerBadge}>
                            {transaction.totalContainers?.toLocaleString()} containers
                        </span>
                    </div>

                    {transaction.details && transaction.details.length > 0 ? (
                        <table className={styles.detailTable}>
                            <thead>
                                <tr>
                                    <th>Material</th>
                                    <th className={styles.right}>Qty</th>
                                    <th className={styles.right}>Unit Value</th>
                                    <th className={styles.right}>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transaction.details.map((d, i) => (
                                    <tr key={d.transactionDetailID ?? i}>
                                        <td>
                                            <span className={styles.materialPill}>
                                                {d.material}
                                            </span>
                                        </td>
                                        <td className={styles.right}>{d.quantity}</td>
                                        <td className={styles.right}>${d.unitValue?.toFixed(4)}</td>
                                        <td className={`${styles.right} ${styles.subtotal}`}>
                                            ${d.value?.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="3" className={styles.totalLabel}>Total</td>
                                    <td className={`${styles.right} ${styles.totalValue}`}>
                                        ${transaction.total?.toFixed(2)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    ) : (
                        <p className={styles.empty}>No line items found for this transaction.</p>
                    )}
                </div>

            </div>
        </div>
    );
}
