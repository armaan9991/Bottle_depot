import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

/*
NEED  TO WRITE ROUTES STILL.
*/



export default function App(){
  const {user} = useAuth();

  return(
    <div>
    <Routes>
      <Route path="/" element={<Login/>} />      /* Route back to login */
      
      <Route path="/ " element={                // route to Admin Dashboard  
        <ProtectedRoute role="Admin">
          <AdminDashBoard />
        </ProtectedRoute>
        }
      />

      <Route path="" element={
        <ProtectedRoute role="Admin">
          <DailyRecord/>
        </ProtectedRoute>
        }
      />

      <Route path="" element={
        <ProtectedRoute role="Admin">
          <ManageEmployees/>
        </ProtectedRoute>
        }
      />

      <Route path="" element={
        <ProtectedRoute role="Admin">
          <ManageShipments/>
        </ProtectedRoute>
        }
      />

      <Route path="" element={
        <ProtectedRoute role="Admin">
          <Reports/>
        </ProtectedRoute>
        }
      />

      <Route path="" element={
        <ProtectedRoute role="Employee">
          <EmployeeDashboard/>
        </ProtectedRoute>
        }
      />

      <Route path="" element={
        <ProtectedRoute  role="Employee">
          <MySchedule/>
        </ProtectedRoute>
        }
      />

    </Routes>      
      
    <Login />
    </div>

  )
}