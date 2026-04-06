import { useNavigate,useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../api/auth";
import path from "path";

const Navbar= () => {
    const { user , logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () =>{
        logoutUser();
        navigate('/');
    };

    const adminLinks = [
        {label: 'Dashboard', path: '/admin/dashboard'},
        { label: 'Employees',    path: '/admin/employees'   },
        { label: 'Shipments',    path: '/admin/shipments'   },
        { label: 'Daily record', path: '/admin/dailyrecord' },
        { label: 'Reports',      path: '/admin/reports'     },
    ]

    const employeeLinks = [
        { label: 'Dashboard', path: '/employee/dashboard' },
        { label: 'My schedule', path: '/employee/schedule' },
    ];

    const links = user?.role =='Admin' ? adminLinks : employeeLinks;

    return(
        <div>
            <div>
                {
                    links.map(link => (
                        <button key={link.path}
                        onClick={() => navigate(link.path)}>link.label</button>
                    ))
                }
            </div>
            
            <div>
                <span> {user?.name}</span>
                {user?.role}

                <button  onClick={handleLogout}>
                    Log out
                </button>
            </div>

        </div>
    )
}