import { Children } from "react";
import { useAuth  } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({childer ,role}){      // we expect two of these as props here. 
    const {user} = useAuth();

    if (!user)
        return <Navigate to="/" />
    if (role && user.role!=role) 
        return <Navigate to="/" />
    return Children 
};