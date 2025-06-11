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

// External Imports
import { ToastContainer } from "react-toastify";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

const Routing = () => {
    return (
        <>
            <ToastContainer />
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
                </Routes>
            </div>
        </>
    );
};

export default Routing;