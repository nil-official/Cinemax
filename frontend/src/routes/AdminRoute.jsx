import { Navigate, Outlet } from "react-router-dom";
import { getUserRole } from "../utils/auth";

const AdminRoute = () => {
  const role = getUserRole();
  return (role === "admin" || role === "superadmin") ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;