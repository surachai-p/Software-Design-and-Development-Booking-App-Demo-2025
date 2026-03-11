import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { token } = useContext(AuthContext);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;
