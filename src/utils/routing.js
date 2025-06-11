import { Navigate, Route, Routes, useLocation, matchPath } from "react-router-dom";
import { useState, useEffect } from "react";

// Principal View Import
import PDashboard from "../pages/Principal/PDashboard.js";
// Teacher View Import
import TDashboard from "../pages/Teacher/TDashboard.js";
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

const Routing = () => {
    return (
        <>
            <div style={{ position: "fixed", top: "20px", left: "50%", transform: "translateX(-50%)", zIndex: 9999 }}>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
            <div>
                <Routes>
                    <Route element={<ProtectedRoute allowedRoles={["PRINCIPAL"]} />}>
                        <Route path="/principal/dashboard" element={<PDashboard />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={["TEACHER"]} />}>
                        <Route path="/teacher/dashboard" element={<TDashboard />} />
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