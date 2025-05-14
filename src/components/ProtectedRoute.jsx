import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Restricts access to routes if user is not authenticated
const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;