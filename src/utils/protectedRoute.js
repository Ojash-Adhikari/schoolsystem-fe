import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

const ProtectedRoute = ({ allowedRoles }) => {
  const user = useAuthUser();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check allowed role
  if (!allowedRoles.includes(user.user_type)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Additional restriction: if in group 1, only allow dashboard and courses
  if (user.groups.includes(1)) {
    const allowedPathsForGroup1 = ["/principal/dashboard"];
    const currentPath = location.pathname;

    const isAllowed = allowedPathsForGroup1.some((path) =>
      currentPath.startsWith(path)
    );

    if (!isAllowed) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
