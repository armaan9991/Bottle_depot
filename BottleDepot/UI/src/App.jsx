import Login from "./pages/Login";
export default function App(){
  const {user} = useAuth();

  return(
    <div>
      { 
      
    <Login />
    </div>

  )
}