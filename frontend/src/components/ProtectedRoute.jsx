import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ adminOnly = false }) => {
    const { isLoggedIn, role } = useSelector(state => state.auth);

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && role !== "admin") {
        return <Navigate to="/" replace />; // Or to a generalized Not Authorized page
    }

    return <Outlet />;
};

export default ProtectedRoute;
