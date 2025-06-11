import React, { useState, useEffect } from 'react';
import { Search, Plus, Menu, X, ChevronUp, ChevronDown, User, Mail, Phone, Calendar, Shield, Clock } from 'lucide-react';

const SDashboard = () => {
    // Mock user data based on the provided structure
    const user = {
        created_at: "2024-01-15T10:30:00Z",
        created_by: null,
        email: "oja.adhikari3@example.com",
        id: 3,
        is_deleted: false,
        phone_number: "+9779848583301",
        updated_at: "2025-06-11T08:58:52.009838Z",
        user_type: "STUDENT",
        username: "ojash3"
    };

    const username = user?.username || 'Guest User';
    const userType = user?.user_type || 'User Type Unknown';

    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({
        field: 'username',
        direction: 'asc'
    });
    const [activeMenuItem, setActiveMenuItem] = useState('personal-development');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showAddStudentForm, setShowAddStudentForm] = useState(false);
    const [animationStep, setAnimationStep] = useState(0);

    // Animation effect for tables
    useEffect(() => {
        const timer = setTimeout(() => {
            if (animationStep < 3) {
                setAnimationStep(animationStep + 1);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [animationStep]);

    const formatDate = (dateString) => {
        if (!dateString) return 'Not Available';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (isDeleted) => {
        return isDeleted ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Inactive
            </span>
        ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
            </span>
        );
    };

    const profileSections = [
        {
            title: "Personal Information",
            icon: <User className="w-5 h-5" />,
            data: [
                { label: "Username", value: user.username, icon: <User className="w-4 h-4" /> },
                { label: "Email", value: user.email, icon: <Mail className="w-4 h-4" /> },
                { label: "Phone Number", value: user.phone_number, icon: <Phone className="w-4 h-4" /> },
                { label: "User Type", value: user.user_type, icon: <Shield className="w-4 h-4" /> }
            ]
        },
        {
            title: "Account Details",
            icon: <Calendar className="w-5 h-5" />,
            data: [
                { label: "User ID", value: user.id, icon: <User className="w-4 h-4" /> },
                { label: "Status", value: getStatusBadge(user.is_deleted), icon: <Shield className="w-4 h-4" /> },
                { label: "Created Date", value: formatDate(user.created_at), icon: <Calendar className="w-4 h-4" /> },
                { label: "Last Updated", value: formatDate(user.updated_at), icon: <Clock className="w-4 h-4" /> }
            ]
        }
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar toggle button for small screens */}
            <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 m-2 rounded-md text-gray-600 hover:text-gray-900 md:hidden fixed top-4 left-4 z-40 bg-white shadow"
                aria-label="Open sidebar"
            >
                <Menu size={24} />
            </button>

            {/* Mock Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
                sidebarOpen || typeof window !== 'undefined' && window.innerWidth >= 768 ? 'translate-x-0' : '-translate-x-full'
            } md:relative md:translate-x-0`}>
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-2 rounded-md text-gray-400 hover:text-gray-600 md:hidden"
                    >
                        <X size={20} />
                    </button>
                </div>
                <nav className="mt-6">
                    <div className="px-3">
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                            Student Menu
                        </div>
                        <div className="space-y-1">
                            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md">
                                Profile
                            </a>
                            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                                Courses
                            </a>
                            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                                Assignments
                            </a>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Overlay for sidebar on mobile */}
            {sidebarOpen && typeof window !== 'undefined' && window.innerWidth < 768 && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black opacity-30 z-20"
                    aria-hidden="true"
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-6">
                            <div className="flex items-center">
                                <div className="ml-4 md:ml-0">
                                    <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
                                    <p className="text-sm text-gray-500">Welcome back, {username}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{username}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Profile Cards */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            {profileSections.map((section, sectionIndex) => (
                                <div
                                    key={section.title}
                                    className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-500 transform ${
                                        animationStep > sectionIndex 
                                            ? 'opacity-100 translate-y-0 scale-100' 
                                            : 'opacity-0 translate-y-4 scale-95'
                                    }`}
                                    style={{
                                        transitionDelay: `${sectionIndex * 200}ms`
                                    }}
                                >
                                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-indigo-100 rounded-lg">
                                                <div className="text-indigo-600">{section.icon}</div>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-4">
                                            {section.data.map((item, itemIndex) => (
                                                <div
                                                    key={item.label}
                                                    className={`flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all duration-300 transform ${
                                                        animationStep > sectionIndex 
                                                            ? 'opacity-100 translate-x-0' 
                                                            : 'opacity-0 translate-x-4'
                                                    }`}
                                                    style={{
                                                        transitionDelay: `${(sectionIndex * 200) + (itemIndex * 100)}ms`
                                                    }}
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div className="text-gray-400">{item.icon}</div>
                                                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                                                    </div>
                                                    <div className="text-sm text-gray-900 font-medium">
                                                        {typeof item.value === 'object' ? item.value : item.value || 'N/A'}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Additional Profile Stats */}
                        <div 
                            className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-500 transform ${
                                animationStep > 2 
                                    ? 'opacity-100 translate-y-0 scale-100' 
                                    : 'opacity-0 translate-y-4 scale-95'
                            }`}
                            style={{
                                transitionDelay: '600ms'
                            }}
                        >
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Calendar className="w-5 h-5 text-green-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">Account Activity</h3>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                                        <div className="text-2xl font-bold text-blue-600">Active</div>
                                        <div className="text-sm text-gray-600">Account Status</div>
                                    </div>
                                    <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-100">
                                        <div className="text-2xl font-bold text-purple-600">Student</div>
                                        <div className="text-sm text-gray-600">User Role</div>
                                    </div>
                                    <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-100">
                                        <div className="text-2xl font-bold text-orange-600">#{user.id}</div>
                                        <div className="text-sm text-gray-600">User ID</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SDashboard;