import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getScheduleByEmployee } from '../../api/schedules';
import styles from './MySchedule.module.css';

const isToday = (dateStr) => {
    const d = new Date(dateStr);
    const t = new Date();
    return d.getFullYear() === t.getFullYear()
        && d.getMonth()    === t.getMonth()
        && d.getDate()     === t.getDate();
};

const fmtTime = (ts) => {
    // ts comes as "08:00:00" from backend
    if (!ts) return '—';
    const [h, m] = ts.toString().split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12  = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
};

export default function MySchedule() {
    const { user }                    = useAuth();
    const [schedules, setSchedules]   = useState([]);
    const [error,     setError]       = useState('');

    useEffect(() => {
        if (user?.workId) {
            getScheduleByEmployee(user.workId)
                .then(res => setSchedules(res))
                .catch(() => setError('Failed to load schedule'));
        }
    }, [user]);

    const upcoming = schedules.filter(s => new Date(s.shiftDate) >= new Date(new Date().setHours(0,0,0,0)));

    return (
        <div className={styles.schPage}>
            <div className={styles.schHeader}>
                <h2 className={styles.schTitle}>My schedule</h2>
                <p className={styles.schSubtitle}>
                    {upcoming.length} upcoming shift{upcoming.length !== 1 ? 's' : ''}
                </p>
            </div>

            {error && <p className={styles.schError}>{error}</p>}

            <div className={styles.schPanel}>
                <table className={styles.schTable}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Start</th>
                            <th>End</th>
                            <th>Duration</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedules.length === 0 ? (
                            <tr>
                                <td colSpan="5" className={styles.schEmpty}>
                                    No shifts scheduled
                                </td>
                            </tr>
                        ) : (
                            schedules.map(s => {
                                const today = isToday(s.shiftDate);
                                return (
                                    <tr key={s.scheduleID} className={today ? styles.schTodayRow : ''}>
                                        <td>
                                            <div className={styles.schDateCell}>
                                                <span className={styles.schDateMain}>
                                                    {new Date(s.shiftDate).toLocaleDateString('en-CA', {
                                                        weekday: 'short', month: 'short', day: 'numeric'
                                                    })}
                                                </span>
                                                {today && <span className={styles.schDateSub}>Today</span>}
                                            </div>
                                        </td>
                                        <td className={styles.schTimeRange}>{fmtTime(s.shiftStart)}</td>
                                        <td className={styles.schTimeRange}>{fmtTime(s.shiftEnd)}</td>
                                        <td className={styles.schDuration}>{s.shiftDuration} hrs</td>
                                        <td>
                                            {today ? (
                                                <span className={styles.schBadgeToday}>Today</span>
                                            ) : s.isBusy ? (
                                                <span className={styles.schBadgeBusy}>Busy</span>
                                            ) : (
                                                <span className={styles.schBadgeAvailable}>Available</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
