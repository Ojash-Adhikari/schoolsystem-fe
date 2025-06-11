import { Navigate, Route, Routes, useLocation, matchPath } from "react-router-dom";
import { useState, useEffect } from "react";

// Principal View Import
import PDashboard from "../pages/Principal/PDashboard.js";

// Teacher View Import
import TDashboard from "../pages/Teacher/TDashboard.js";
import Assignment from "../pages/Teacher/Assignment.js";
// User View Import
import SDashboard from "../pages/Student/SDashboard.js";

// Account View Import
import Login from "../pages/Account/Login.js";
import Register from "../pages/Account/Register.js";

// Protected Route Import
import ProtectedRoute from "./protectedRoute.js";

// Error Imports
import Unauthorized from "../pages/Components/Unauthorized.jsx";

// External Imports
import { ToastContainer } from "react-toastify";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import Sidebar from "../pages/Components/Sidebar.js";

const Routing = () => {
    const auth = useAuthUser(); // access user role
    const location = useLocation();

    // Define routes where sidebar is hidden
    const hideSidebarPaths = ['/', '/register', '/unauthorized'];
    const shouldShowSidebar = !hideSidebarPaths.includes(location.pathname);

    const role = auth?.user_type;

    // Optional: Set activeItem from current path (for highlighting)
    const getActiveItem = () => {
        const path = location.pathname;
        if (path.includes('assignment')) return 'assignments';
        if (path.includes('career')) return 'career-guidance';
        if (path.includes('life')) return 'life-skills';
        if (path.includes('report')) return 'reports';
        if (path.includes('settings')) return 'settings';
        return 'personal-development';
    };
    return (
        <>
            <div style={{ position: "fixed", top: "20px", left: "50%", transform: "translateX(-50%)", zIndex: 9999 }}>
                <ToastContainer position="top-center" autoClose={3000} />
            </div>

            {shouldShowSidebar && role && (
                <Sidebar
                    activeItem={getActiveItem()}
                    isOpen={true}
                    onClose={() => { }}
                />
            )}

            <div className="ml-16"> {/* offset to account for sidebar */}
                <Routes>
                    <Route element={<ProtectedRoute allowedRoles={["PRINCIPAL"]} />}>
                        <Route path="/principal/dashboard" element={<PDashboard />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={["TEACHER"]} />}>
                        <Route path="/teacher/dashboard" element={<TDashboard />} />
                        <Route path="/teacher/assignment" element={<Assignment />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={["STUDENT"]} />}>
                        <Route path="/user/dashboard" element={<SDashboard />} />
                    </Route>

                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />
                </Routes>
            </div>
        </>
    );
};

export default Routing;