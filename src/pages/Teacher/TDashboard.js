import React, { useState } from 'react';
import { Search, Plus, Menu, X } from 'lucide-react';
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import useFetchAuth from '../../utils/Account/useFetchAuth';
import axios from '../../utils/Account/axios';

// Sidebar Component
const Sidebar = ({ activeItem, onItemClick, isOpen, onClose }) => {
    const menuItems = [
        { id: 'personal-development', label: 'Personal Development' },
        { id: 'academic-coaching', label: 'Academic Coaching' },
        { id: 'career-guidance', label: 'Career Guidance' },
        { id: 'life-skills', label: 'Life Skills' },
        { id: 'reports', label: 'Reports' },
        { id: 'settings', label: 'Settings' }
    ];

    if (!isOpen) return null;

    return (
        <div className="w-64 bg-gray-50 h-screen border-r border-gray-200 p-4 fixed top-0 left-0 z-30">
            <div className="mb-8 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
                <button onClick={onClose} aria-label="Close sidebar" className="text-gray-600 hover:text-gray-900">
                    <X size={20} />
                </button>
            </div>
            <nav>
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.id}>
                            <button
                                onClick={() => onItemClick(item.id)}
                                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeItem === item.id
                                    ? 'bg-blue-100 text-blue-700 font-medium'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

// Add Student Form Component
const AddStudentForm = ({ isOpen, onClose, onSubmit }) => {
    const user = useAuthUser();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone_number: '',
        updated_at:new Date().toISOString(),
        created_by: user.id,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.phone_number.trim()) {
            newErrors.phone_number = 'Phone number is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                ...formData,
                user_type: 'STUDENT'
            };

            await onSubmit(payload);

            // Reset form
            setFormData({
                username: '',
                email: '',
                phone_number: ''
            });
            setErrors({});
            onClose();
        } catch (error) {
            console.error('Error adding student:', error);
            // Handle error (you might want to show an error message)
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({
            username: '',
            email: '',
            phone_number: ''
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-gray-200/50 z-40"
                onClick={handleClose}
            />

            {/* Form Panel */}
            <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Add New Student</h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Close form"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex-1 p-6 overflow-y-auto">
                        <div className="space-y-4">
                            {/* Username Field */}
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                    Username *
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.username ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter username"
                                />
                                {errors.username && (
                                    <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter email address"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            {/* Phone Number Field */}
                            <div>
                                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    id="phone_number"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone_number ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter phone number"
                                />
                                {errors.phone_number && (
                                    <p className="mt-1 text-sm text-red-600">{errors.phone_number}</p>
                                )}
                            </div>

                            {/* User Type Info */}
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <p className="text-sm text-blue-700">
                                    <strong>User Type:</strong> Student (default)
                                </p>
                            </div>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-200">
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Adding...' : 'Add Student'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// Main Dashboard Component
const TDashboard = () => {
    const auth = useAuthUser();
    const user = auth;
    const username = user?.username || 'Guest User';
    const userType = user?.user_type || 'User Type Unknown';

    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [activeMenuItem, setActiveMenuItem] = useState('personal-development');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showAddStudentForm, setShowAddStudentForm] = useState(false);

    const { data: student, isPending, error, refetch } = useFetchAuth("users/users/");
    const users = student || [];

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedUsers = filteredUsers.slice().sort((a, b) => {
        if (sortBy === 'name') {
            return a.username.localeCompare(b.username);
        }
        if (sortBy === 'status') {
            // Assuming user has a 'status' property, else fallback to ''
            const statusA = (a.status || '').toLowerCase();
            const statusB = (b.status || '').toLowerCase();
            return statusA.localeCompare(statusB);
        }
        if (sortBy === 'nextSession') {
            // Assuming user.nextSession is an ISO date string or null
            const dateA = a.nextSession ? new Date(a.nextSession) : new Date(0);
            const dateB = b.nextSession ? new Date(b.nextSession) : new Date(0);
            return dateA - dateB;
        }
        return 0;
    });

    const handleAddStudent = async (studentData) => {
        try {
            const response = await axios.post('api/users/users/', studentData);
            console.log('Student added successfully:', response.data);
            // Refresh the users list
            refetch();
        } catch (error) {
            console.error('Error adding student:', error);
            throw error; // Re-throw to handle in form component
        }
    };

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

            {/* Sidebar */}
            <Sidebar
                activeItem={activeMenuItem}
                onItemClick={(id) => {
                    setActiveMenuItem(id);
                    setSidebarOpen(false); // close sidebar after selection on mobile
                }}
                isOpen={sidebarOpen || window.innerWidth >= 768} // open by default on md+
                onClose={() => setSidebarOpen(false)}
            />

            {/* Overlay for sidebar on mobile */}
            {sidebarOpen && window.innerWidth < 768 && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black opacity-30 z-20"
                    aria-hidden="true"
                />
            )}

            <div className="flex-1 p-6 ml-0 md:ml-64">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{username}</h1>
                            <p className="text-gray-600 mt-1">{userType}</p>
                        </div>
                        <button
                            onClick={() => setShowAddStudentForm(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add a new Student
                        </button>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search for a client"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex items-center gap-4 ml-4">
                            <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                Search
                            </button>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="name">Sort By</option>
                                <option value="name">Name</option>
                                <option value="status">Status</option>
                                <option value="nextSession">Next Session</option>
                            </select>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mb-4">
                        <p className="text-gray-600">{filteredUsers.length} Results</p>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-3 px-6 font-medium text-gray-700">Username</th>
                                    <th className="text-left py-3 px-6 font-medium text-gray-700">Email</th>
                                    <th className="text-left py-3 px-6 font-medium text-gray-700">Phone Number</th>
                                    <th className="text-left py-3 px-6 font-medium text-gray-700">User Type</th>
                                    <th className="text-left py-3 px-6 font-medium text-gray-700"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user, index) => (
                                    <tr key={user.id} className={index !== filteredUsers.length - 1 ? 'border-b border-gray-100' : ''}>
                                        <td className="py-4 px-6 text-gray-900">{user.username}</td>
                                        <td className="py-4 px-6 text-gray-700">{user.email}</td>
                                        <td className="py-4 px-6 text-gray-700">{user.phone_number}</td>
                                        <td className="py-4 px-6 text-gray-700 font-semibold">{user.user_type}</td>
                                        <td className="py-4 px-6">
                                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                                View Profile
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Student Form */}
            <AddStudentForm
                isOpen={showAddStudentForm}
                onClose={() => setShowAddStudentForm(false)}
                onSubmit={handleAddStudent}
            />
        </div>
    );
};

export default TDashboard;