import { createContext,useContext,useState } from "react";

const AuthContext=createContext();

export default function AuthProvider(childern){
    const[user, setUser]=useState(null)     // null because we want user to be either null or particular user.

    const login =(UserData)=>{
        setUser(UserData);
    }
    const logout=()=>{
        setUser(null);
    }
    return (
        <AuthContext.Provieder value={{user,    login   ,  logout   }   }>
            {childern}
        </AuthContext.Provieder>
    );
}