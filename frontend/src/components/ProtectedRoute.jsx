// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Redirect to auth page if not authenticated
    return <Navigate to="/auth" />;
  }

  return children;
};

export default ProtectedRoute;
