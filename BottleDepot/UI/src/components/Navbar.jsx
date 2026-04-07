import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate         = useNavigate();
    const location         = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const adminLinks = [
        { label: 'Dashboard',    path: '/admin/dashboard'   },
        { label: 'Employees',    path: '/admin/employees'   },
        { label: 'Shipments',    path: '/admin/shipments'   },
        { label: 'Daily record', path: '/admin/dailyrecord' },
        { label: 'Reports',      path: '/admin/reports'     },
    ];

    const employeeLinks = [
        { label: 'Dashboard',   path: '/employee/dashboard' },
        { label: 'My schedule', path: '/employee/schedule'  },
    ];

    const links = user?.role === 'Admin' ? adminLinks : employeeLinks;

    return (
        <nav className={styles.navbar}>
            <span className={styles.brand}>
                Bottle<span>Depot</span>
            </span>

            <div className={styles.links}>
                {links.map(link => (
                    <button
                        key={link.path}
                        className={`${styles.navLink} ${location.pathname === link.path ? styles.navLinkActive : ''}`}
                        onClick={() => navigate(link.path)}
                    >
                        {link.label}
                    </button>
                ))}
            </div>

            <div className={styles.right}>
                <span className={styles.userName}>{user?.name}</span>
                <span className={`${styles.badge} ${user?.role === 'Admin' ? styles.badgeAdmin : styles.badgeEmployee}`}>
                    {user?.role}
                </span>
                <button className={styles.logoutBtn} onClick={handleLogout}>
                    Log out
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
