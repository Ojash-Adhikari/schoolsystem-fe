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
            <div style={{ position: "relative", zIndex: 2 }}>
                <Routes>
                    {/* Define routes here */}
                    {/* Principal View Routes */}
                    <Route element={<ProtectedRoute allowedRoles={["PRINCIPAL"]} />}>
                        <Route
                            path="/admin/*"
                            element={
                                <div className="ml-16 p-4">
                                    <Routes>
                                        <Route path="/dashboard" element={<PDashboard />} />
                                    </Routes>
                                </div>
                            }
                        />
                    </Route>
                    {/* Teacher View Routes */}
                    <Route element={<ProtectedRoute allowedRoles={["TEACHER", "PRINCIPAL"]} />}>
                        <Route
                            path="/teacher/*"
                            element={
                                <div className="ml-16 p-4">
                                    <Routes>
                                        <Route path="/dashboard" element={<TDashboard />} />
                                    </Routes>
                                </div>
                            }
                        />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={["STUDENT", "PRINCIPAL"]} />}>
                        <Route path="/user/*"
                            element={
                                <Routes>
                                    {/* New Routes for Battle and Complaint */}
                                    <Route path="/dashboard" element={<SDashboard />} />
                                </Routes>
                            }
                        />
                    </Route>

                    {/* Login route should not have canvas or custom cursor */}
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </div>
        </>
    );
};

export default Routing;