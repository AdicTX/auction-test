import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; // Puedes mostrar un spinner aquí
  }

  return user ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
