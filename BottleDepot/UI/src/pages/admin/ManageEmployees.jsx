import { useState, useEffect } from 'react';
import { getAllEmployees, createEmployee, updateEmployee } from '../../api/employees';
import styles from './ManageEmployees.module.css';

const EMPTY_FORM = {
    name: '', email: '', phone: '', role: 'Employee',
    wageRate: '', dateOfHire: '', password: '', supervisorID: ''
};

export default function ManageEmployees() {
    const [employees, setEmployees] = useState([]);
    const [showForm,  setShowForm]  = useState(false);
    const [editingID, setEditingID] = useState(null);
    const [form,      setForm]      = useState(EMPTY_FORM);
    const [error,     setError]     = useState('');
    const [saving,    setSaving]    = useState(false);

    useEffect(() => { load(); }, []);

    const load = async () => {
        try {
            const res = await getAllEmployees();
            setEmployees(res.data);
        } catch { setError('Failed to load employees'); }
    };

    const openNew = () => {
        setEditingID(null);
        setForm(EMPTY_FORM);
        setShowForm(true);
        setError('');
    };

    const openEdit = (emp) => {
        setEditingID(emp.workID);
        setForm({
            name:        emp.name,
            email:       emp.email,
            phone:       emp.phone,
            role:        emp.role,
            wageRate:    emp.wageRate,
            dateOfHire:  emp.dateOfHire?.split('T')[0] ?? '',
            password:    '',
            supervisorID: emp.supervisorID ?? ''
        });
        setShowForm(true);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const payload = {
                ...form,
                wageRate:    parseFloat(form.wageRate),
                supervisorID: form.supervisorID ? parseInt(form.supervisorID) : null
            };
            if (editingID) {
                await updateEmployee(editingID, payload);
            } else {
                await createEmployee(payload);
            }
            setShowForm(false);
            setForm(EMPTY_FORM);
            await load();
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to save employee.');
        } finally {
            setSaving(false);
        }
    };

    const f = (field) => ({
        value:    form[field],
        onChange: (e) => setForm(p => ({ ...p, [field]: e.target.value }))
    });

    return (
        <div className={styles.empPage}>
            <div className={styles.empHeader}>
                <div>
                    <h2 className={styles.empTitle}>Employees</h2>
                    <p className={styles.empSubtitle}>{employees.length} team members</p>
                </div>
                <button className={styles.empAddBtn} onClick={openNew}>
                    + Add employee
                </button>
            </div>

            {error && <p className={styles.empError}>{error}</p>}

            {/* ── Form ── */}
            {showForm && (
                <div className={styles.empFormWrap}>
                    <div className={styles.empFormHead}>
                        <span className={styles.empFormHeadTitle}>
                            {editingID ? 'Edit employee' : 'New employee'}
                        </span>
                        <button className={styles.empFormCancelBtn} onClick={() => setShowForm(false)}>×</button>
                    </div>
                    <div className={styles.empFormBody}>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.empFormGrid}>
                                <div className={styles.empFormField}>
                                    <label>Full name</label>
                                    <input placeholder="Sara L." required {...f('name')} />
                                </div>
                                <div className={styles.empFormField}>
                                    <label>Email</label>
                                    <input type="email" placeholder="sara@depot.com" required {...f('email')} />
                                </div>
                                <div className={styles.empFormField}>
                                    <label>Phone</label>
                                    <input placeholder="403-555-0001" required {...f('phone')} />
                                </div>
                                <div className={styles.empFormField}>
                                    <label>Role</label>
                                    <select {...f('role')}>
                                        <option value="Employee">Employee</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </div>
                                <div className={styles.empFormField}>
                                    <label>Wage rate ($/hr)</label>
                                    <input type="number" step="0.01" placeholder="17.00" required {...f('wageRate')} />
                                </div>
                                <div className={styles.empFormField}>
                                    <label>Date of hire</label>
                                    <input type="date" required {...f('dateOfHire')} />
                                </div>
                                {!editingID && (
                                    <div className={styles.empFormField}>
                                        <label>Password</label>
                                        <input type="password" placeholder="••••••••" required {...f('password')} />
                                    </div>
                                )}
                                <div className={styles.empFormField}>
                                    <label>Supervisor ID (optional)</label>
                                    <input type="number" placeholder="Leave blank if none" {...f('supervisorID')} />
                                </div>
                            </div>
                            <div className={styles.empFormActions}>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    style={{ padding: '9px 16px', background: 'none', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', color: '#64748b', cursor: 'pointer', fontFamily: 'inherit' }}
                                >
                                    Cancel
                                </button>
                                <button className={styles.empSaveBtn} type="submit" disabled={saving}>
                                    {saving ? 'Saving…' : (editingID ? 'Save changes' : 'Create employee')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Table ── */}
            <div className={styles.empTablePanel}>
                <table className={styles.empTable}>
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Role</th>
                            <th>Phone</th>
                            <th>Wage</th>
                            <th>Hired</th>
                            <th>Supervisor</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.length === 0 ? (
                            <tr>
                                <td colSpan="7" className={styles.empEmpty}>No employees found</td>
                            </tr>
                        ) : (
                            employees.map(emp => (
                                <tr key={emp.workID}>
                                    <td>
                                        <div className={styles.empNameCell}>
                                            <div className={styles.empAvatar}>
                                                {emp.name?.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div className={styles.empName}>{emp.name}</div>
                                                <div className={styles.empEmail}>{emp.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`${styles.empRoleBadge} ${emp.role === 'Admin' ? styles.empRoleAdmin : styles.empRoleEmployee}`}>
                                            {emp.role}
                                        </span>
                                    </td>
                                    <td style={{ color: '#64748b' }}>{emp.phone}</td>
                                    <td style={{ fontVariantNumeric: 'tabular-nums' }}>${emp.wageRate}/hr</td>
                                    <td style={{ color: '#64748b' }}>
                                        {emp.dateOfHire ? new Date(emp.dateOfHire).toLocaleDateString() : '—'}
                                    </td>
                                    <td style={{ color: '#64748b' }}>{emp.supervisorName || '—'}</td>
                                    <td>
                                        <button className={styles.empEditBtn} onClick={() => openEdit(emp)}>
                                            Edit
                                        </button>
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
