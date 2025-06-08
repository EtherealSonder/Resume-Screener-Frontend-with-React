import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = (userData, remember = false) => {
        setUser(userData);
        if (remember) {
            localStorage.setItem("user", JSON.stringify(userData));
            sessionStorage.removeItem("user");
        } else {
            sessionStorage.setItem("user", JSON.stringify(userData));
            localStorage.removeItem("user");
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");
    };

    //Keep user state synced to storage when manually updated (e.g., name/email)
    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
