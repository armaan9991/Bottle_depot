import { createContext, useContext, useState } from "react";
import { logoutUser } from "../api/auth"; // Brings in the token-clearing function

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null); // Clears the user from React memory
        logoutUser();  // Clears the JWT token from the browser!
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);