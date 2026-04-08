import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import DailyRecord from './pages/admin/DailyRecord';
import ManageShipments from './pages/admin/ManageShipments';
import ManageEmployees from './pages/admin/ManageEmployees';
import Reports from './pages/admin/Reports';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import MySchedule from './pages/employee/MySchedule';
import TransactionForm from './pages/TransactionForm';
import ManageSchedule from './pages/admin/ManageSchedule';

export default function App() {
    const { user } = useAuth();

    return (
        <div>
            {user && <Navbar />}

            <Routes>
                {/* Public */}
                <Route path="/" element={<Login />} />

                {/* Shared — both roles can create transactions */}
                <Route path="/transaction/new" element={
                    <ProtectedRoute >
                        <TransactionForm />
                    </ProtectedRoute>
                } />

                {/* Admin routes */}
                <Route path="/admin/dashboard" element={
                    <ProtectedRoute role="Admin">
                        <AdminDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/admin/dailyrecord" element={
                    <ProtectedRoute role="Admin">
                        <DailyRecord />
                    </ProtectedRoute>
                } />
                <Route path="/admin/employees" element={
                    <ProtectedRoute role="Admin">
                        <ManageEmployees />
                    </ProtectedRoute>
                } />
                <Route path="/admin/shipments" element={
                    <ProtectedRoute role="Admin">
                        <ManageShipments />
                    </ProtectedRoute>
                } />
                <Route path="/admin/reports" element={
                    <ProtectedRoute role="Admin">
                        <Reports />
                    </ProtectedRoute>
                } />

                {/* Employee routes */}
                <Route path="/employee/dashboard" element={
                    <ProtectedRoute role="Employee">
                        <EmployeeDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/employee/schedule" element={
                    <ProtectedRoute role="Employee">
                        <MySchedule />
                    </ProtectedRoute>
                } />
                <Route path="/admin/schedule" element={
                     <ProtectedRoute role="Admin">
                        <ManageSchedule />
                    </ProtectedRoute>
                    } />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
    );
}
