import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getUserRole } from "../utils/auth"; // Import the function

const AdminRoute = () => {
  const role = getUserRole();

  return role === "admin" ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;