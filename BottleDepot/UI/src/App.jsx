import Login from "./pages/Login";
export default function App(){
  const {user} = useAuth();

  return(
    <div>
      {/* <Routes>
        // we cheack if login page is used to log in as admin role.
        <Route path="/admin/dashboard" element={
          <ProtectedRoute role= "Admin">
            <AdminDashboard/>
          </ProtectedRoute>
        } />
        
      </Routes> */}
    <Login />
    </div>

  )
}