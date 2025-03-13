import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading, isAuthenticated } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated()) return <Navigate to="/" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log(allowedRoles);

    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
