import { useState, useEffect } from 'react';
import { getAllSchedules, createSchedule } from '../../api/schedules';
import { getAllEmployees } from '../../api/employees';
import styles from './ManageSchedule.module.css';

const EMPTY_FORM = {
    workID:        '',
    shiftDate:     '',
    shiftStart:    '',
    shiftEnd:      '',
    isBusy:        false,
};

// Compute duration in hours from two "HH:MM" strings
const calcDuration = (start, end) => {
    if (!start || !end) return 0;
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const diff = (eh * 60 + em) - (sh * 60 + sm);
    return diff > 0 ? parseFloat((diff / 60).toFixed(2)) : 0;
};

export default function ManageSchedule() {
    const [schedules, setSchedules] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [showForm,  setShowForm]  = useState(false);
    const [form,      setForm]      = useState(EMPTY_FORM);
    const [error,     setError]     = useState('');
    const [saving,    setSaving]    = useState(false);

    useEffect(() => { load(); }, []);

    const load = async () => {
        try {
            const [scheds, emps] = await Promise.all([
                getAllSchedules(),
                getAllEmployees(),
            ]);
            setSchedules(scheds);
            setEmployees(emps);
        } catch {
            setError('Failed to load schedule data');
        }
    };

    const openNew = () => {
        setForm(EMPTY_FORM);
        setShowForm(true);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        const duration = calcDuration(form.shiftStart, form.shiftEnd);
        if (duration <= 0) {
            setError('Shift end must be after shift start.');
            setSaving(false);
            return;
        }

        try {
            const payload = {
                WorkID:        parseInt(form.workID),
                ShiftDate:     form.shiftDate,
                ShiftStart:    form.shiftStart + ':00',   // API expects HH:MM:SS
                ShiftEnd:      form.shiftEnd   + ':00',
                ShiftDuration: duration,
                IsBusy:        form.isBusy,
            };
            await createSchedule(payload);
            setShowForm(false);
            setForm(EMPTY_FORM);
            await load();
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to create schedule.');
        } finally {
            setSaving(false);
        }
    };

    const f = (field) => ({
        value:    form[field],
        onChange: (e) => setForm(p => ({ ...p, [field]: e.target.value })),
    });

    const fmt = (date) => new Date(date).toLocaleDateString();
    const fmtTime = (ts) => {
        if (!ts) return '—';
        const [h, m] = ts.split(':');
        const hour = parseInt(h);
        return `${hour % 12 || 12}:${m} ${hour < 12 ? 'AM' : 'PM'}`;
    };

    // Group schedules by date for display
    const grouped = schedules.reduce((acc, s) => {
        const key = s.shiftDate?.split('T')[0] ?? s.shiftDate;
        (acc[key] = acc[key] || []).push(s);
        return acc;
    }, {});

    return (
        <div className={styles.schPage}>
            <div className={styles.schHeader}>
                <div>
                    <h2 className={styles.schTitle}>Schedule</h2>
                    <p className={styles.schSubtitle}>{schedules.length} shifts scheduled</p>
                </div>
                <button className={styles.schAddBtn} onClick={openNew}>
                    + Add shift
                </button>
            </div>

            {error && <p className={styles.schError}>{error}</p>}

            {/* ── Form ── */}
            {showForm && (
                <div className={styles.schFormWrap}>
                    <div className={styles.schFormHead}>
                        <span className={styles.schFormHeadTitle}>New shift</span>
                        <button className={styles.schFormCancelBtn} onClick={() => setShowForm(false)}>×</button>
                    </div>
                    <div className={styles.schFormBody}>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.schFormGrid}>

                                <div className={styles.schFormField}>
                                    <label>Employee</label>
                                    <select required {...f('workID')}>
                                        <option value="">Select employee…</option>
                                        {employees.map(emp => (
                                            <option key={emp.workID} value={emp.workID}>
                                                {emp.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className={styles.schFormField}>
                                    <label>Shift date</label>
                                    <input type="date" required {...f('shiftDate')} />
                                </div>

                                <div className={styles.schFormField}>
                                    <label>Start time</label>
                                    <input type="time" required {...f('shiftStart')} />
                                </div>

                                <div className={styles.schFormField}>
                                    <label>End time</label>
                                    <input type="time" required {...f('shiftEnd')} />
                                </div>

                                {/* Duration preview */}
                                {form.shiftStart && form.shiftEnd && (
                                    <div className={styles.schFormField}>
                                        <label>Duration</label>
                                        <div className={styles.schDurationPreview}>
                                            {calcDuration(form.shiftStart, form.shiftEnd)} hrs
                                        </div>
                                    </div>
                                )}

                                <div className={styles.schFormField}>
                                    <label>Mark as busy</label>
                                    <select
                                        value={form.isBusy}
                                        onChange={e => setForm(p => ({ ...p, isBusy: e.target.value === 'true' }))}
                                    >
                                        <option value="false">No</option>
                                        <option value="true">Yes</option>
                                    </select>
                                </div>

                            </div>
                            <div className={styles.schFormActions}>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className={styles.schCancelBtn}
                                >
                                    Cancel
                                </button>
                                <button className={styles.schSaveBtn} type="submit" disabled={saving}>
                                    {saving ? 'Saving…' : 'Create shift'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Table ── */}
            <div className={styles.schTablePanel}>
                <table className={styles.schTable}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Employee</th>
                            <th>Start</th>
                            <th>End</th>
                            <th>Duration</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedules.length === 0 ? (
                            <tr>
                                <td colSpan="6" className={styles.schEmpty}>No shifts scheduled</td>
                            </tr>
                        ) : (
                            schedules.map(s => (
                                <tr key={s.scheduleID}>
                                    <td className={styles.schMuted}>
                                        {fmt(s.shiftDate)}
                                    </td>
                                    <td>
                                        <div className={styles.schNameCell}>
                                            <div className={styles.schAvatar}>
                                                {s.employeeName?.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            {s.employeeName}
                                        </div>
                                    </td>
                                    <td>{fmtTime(s.shiftStart)}</td>
                                    <td>{fmtTime(s.shiftEnd)}</td>
                                    <td className={styles.schDuration}>{s.shiftDuration} hrs</td>
                                    <td>
                                        <span className={s.isBusy ? styles.schBadgeBusy : styles.schBadgeFree}>
                                            {s.isBusy ? 'Busy' : 'Available'}
                                        </span>
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
