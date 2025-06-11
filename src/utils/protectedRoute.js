import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

const ProtectedRoute = ({ allowedRoles }) => {
  const auth = useAuthUser();
  const user = auth; // Get the actual user object
  const location = useLocation();

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Role not allowed
  if (!allowedRoles.includes(user.user_type)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Optional: Group-based restrictions
  // if (user.groups?.includes(1)) {
  //   const allowedPathsForGroup1 = ["/principal/dashboard"];
  //   const isAllowed = allowedPathsForGroup1.some(path =>
  //     location.pathname.startsWith(path)
  //   );
  //   if (!isAllowed) {
  //     return <Navigate to="/unauthorized" replace />;
  //   }
  // }

  return <Outlet />;
};

export default ProtectedRoute;
