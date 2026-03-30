import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Verifica si hay un token en sessionStorage 
  const isAuthenticated = !!sessionStorage.getItem("token");
  // Si no esta autenticado, redirige a la pagina de login
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  return children; //children es cualquier elemento dentro de ProtectedRoute en App.js
};

export default ProtectedRoute;
