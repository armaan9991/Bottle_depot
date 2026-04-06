import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { loginUser as loginApi } from '../api/auth';
import styles from './Login.module.css';

export default function Login() {
    const [workId, setWorkId]     = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const resp = await loginApi(workId, password);
            if (resp.role === 'Admin') navigate('/admin/dashboard');
            else                       navigate('/employee/dashboard');
        } catch {
            setError('Invalid Employee ID or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginPage}>
            <div className={styles.loginCard}>

                <div className={styles.loginPanel}>
                    <div>
                        <div className={styles.loginBrand}>RecycleOps</div>
                        <div className={styles.loginTagline}>Employee management portal</div>
                    </div>
                    <div className={styles.loginCopyright}>© 2026 RecycleOps</div>
                </div>

                <div className={styles.loginForm}>
                    <div className={styles.loginEyebrow}>Employee portal</div>
                    <h1 className={styles.loginTitle}>Welcome back</h1>
                    <p className={styles.loginSubtitle}>Sign in to access your dashboard</p>

                    <form onSubmit={handleLogin}>
                        <div className={styles.loginField}>
                            <label>Employee ID</label>
                            <input
                                type="text"
                                placeholder="e.g. EMP-0042"
                                value={workId}
                                onChange={e => setWorkId(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.loginField}>
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && <p className={styles.loginError}>{error}</p>}

                        <button type="submit" disabled={loading} className={styles.loginBtn}>
                            {loading ? 'Signing in…' : 'Sign in'}
                        </button>
                    </form>

                    <div className={styles.loginDivider}>
                        <hr /><span>need help?</span><hr />
                    </div>
                    <p className={styles.loginHelp}>Contact your system administrator</p>
                </div>

            </div>
        </div>
    );
}
