import React, { useState } from 'react';
import { Search, Plus, Menu, X, ChevronUp, ChevronDown } from 'lucide-react';
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import useFetchAuth from '../../utils/Account/useFetchAuth';
import axios from '../../utils/Account/axios';
import { toast } from "react-toastify";
import Sidebar from '../Components/Sidebar';
import AddUserDropdown from '../Components/AddUserDropdown.jsx';
import ProfileModal from '../Components/ProfileModal.jsx';
// Add Student Form Component
const AddStudentForm = ({ isOpen, onClose, onSubmit }) => {
    const user = useAuthUser();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone_number: '',
        updated_at: new Date().toISOString(),
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

// This components is same as above, can be combined with condition
const AddTeacherForm = ({ isOpen, onClose, onSubmit }) => {
    const user = useAuthUser();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone_number: '',
        updated_at: new Date().toISOString(),
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
                user_type: 'TEACHER'
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
            console.error('Error adding Teacher:', error);
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
                        <h2 className="text-xl font-semibold text-gray-900">Add New Teacher</h2>
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
                                    <strong>User Type:</strong> Teacher (default)
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

// Main PDashboard Component
const PDashboard = () => {
    const auth = useAuthUser();
    const user = auth;
    const username = user?.username || 'Guest User';
    const userType = user?.user_type || 'User Type Unknown';

    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({
        field: 'username',
        direction: 'asc'
    });
    const [showAddStudentForm, setShowAddStudentForm] = useState(false);
    const [showAddTeacherForm, setShowAddTeacherForm] = useState(false);

    const { data: student, isPending, error, refetch } = useFetchAuth("users/users/");
    console.log(student);
    const users = student || [];

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedUsers = filteredUsers.slice().sort((a, b) => {
        const { field, direction } = sortConfig;
        let aValue, bValue;

        switch (field) {
            case 'username':
                aValue = a.username.toLowerCase();
                bValue = b.username.toLowerCase();
                break;
            case 'email':
                aValue = a.email.toLowerCase();
                bValue = b.email.toLowerCase();
                break;
            case 'created_at':
                aValue = new Date(a.created_at);
                bValue = new Date(b.created_at);
                break;
            case 'user_type':
                aValue = a.user_type.toLowerCase();
                bValue = b.user_type.toLowerCase();
                break;
            case 'is_enrolled':
                aValue = a.is_enrolled.toLowerCase();
                bValue = b.is_enrolled.toLowerCase();
                break;
            default:
                return 0;
        }

        let comparison = 0;
        if (aValue > bValue) {
            comparison = 1;
        } else if (aValue < bValue) {
            comparison = -1;
        }

        return direction === 'desc' ? comparison * -1 : comparison;
    });

    const handleSort = (field) => {
        setSortConfig(prevConfig => ({
            field,
            direction: prevConfig.field === field && prevConfig.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const getSortIcon = (field) => {
        if (sortConfig.field !== field) {
            return null;
        }
        return sortConfig.direction === 'asc' ?
            <ChevronUp className="w-4 h-4 ml-1" /> :
            <ChevronDown className="w-4 h-4 ml-1" />;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleAddStudent = async (studentData) => {
        try {
            const response = await axios.post('api/users/users/', studentData);
            console.log('Student added successfully:', response.data);
            // Refresh the users list
            refetch();
            toast.success("User Added Successfully")
        } catch (error) {
            if (error.response && error.response.data) {
                const errorData = error.response.data;

                // Convert the error object to a readable string
                const messages = Object.entries(errorData)
                    .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
                    .join("\n");

                toast.error(messages);  // shows field: message1, message2
            } else {
                toast.error("An unexpected error occurred.");
            }
            console.error('Error adding student:', error);
            throw error; // Re-throw to handle in form component
        }
    };

    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil(sortedUsers.length / usersPerPage);
    const [selectedUser, setSelectedUser] = useState(null);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <div className="flex-1 p-6 ml-0 md:ml-32">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{username}</h1>
                            <p className="text-gray-600 mt-1">{userType}</p>
                        </div>

                        <AddUserDropdown
                            onAddStudent={() => setShowAddStudentForm(true)}
                            onAddTeacher={() => setShowAddTeacherForm(true)}
                        />
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
                            <div className="flex items-center gap-2">
                                <select
                                    value={sortConfig.field}
                                    onChange={(e) => setSortConfig(prev => ({ ...prev, field: e.target.value }))}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="username">Sort by Name</option>
                                    <option value="email">Sort by Email</option>
                                    <option value="created_at">Sort by Created Date</option>
                                    <option value="user_type">Sort by User Type</option>
                                    <option value="is_enrolled">Sort by Enrollment Status</option>
                                </select>
                                <button
                                    onClick={() => setSortConfig(prev => ({
                                        ...prev,
                                        direction: prev.direction === 'asc' ? 'desc' : 'asc'
                                    }))}
                                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
                                    title={`Sort ${sortConfig.direction === 'asc' ? 'Descending' : 'Ascending'}`}
                                >
                                    {sortConfig.direction === 'asc' ? 'A-Z' : 'Z-A'}
                                    {sortConfig.direction === 'asc' ?
                                        <ChevronUp className="w-4 h-4" /> :
                                        <ChevronDown className="w-4 h-4" />
                                    }
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mb-4">
                        <p className="text-gray-600">
                            {filteredUsers.length} Results
                            {sortConfig.field && (
                                <span className="ml-2 text-sm">
                                    (sorted by {sortConfig.field.replace('_', ' ')} - {sortConfig.direction === 'asc' ? 'ascending' : 'descending'})
                                </span>
                            )}
                        </p>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th
                                        className="text-left py-3 px-6 font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                                        onClick={() => handleSort('username')}
                                    >
                                        <div className="flex items-center">
                                            Username
                                            {getSortIcon('username')}
                                        </div>
                                    </th>
                                    <th
                                        className="text-left py-3 px-6 font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                                        onClick={() => handleSort('email')}
                                    >
                                        <div className="flex items-center">
                                            Email
                                            {getSortIcon('email')}
                                        </div>
                                    </th>
                                    <th className="text-left py-3 px-6 font-medium text-gray-700">Phone Number</th>
                                    <th
                                        className="text-left py-3 px-6 font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                                        onClick={() => handleSort('user_type')}
                                    >
                                        <div className="flex items-center">
                                            User Type
                                            {getSortIcon('user_type')}
                                        </div>
                                    </th>
                                    <th
                                        className="text-left py-3 px-6 font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                                        onClick={() => handleSort('created_at')}
                                    >
                                        <div className="flex items-center">
                                            Created At
                                            {getSortIcon('created_at')}
                                        </div>
                                    </th>
                                    <th
                                        className="text-left py-3 px-6 font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                                        onClick={() => handleSort('Enrollment Status')}
                                    >
                                        <div className="flex items-center">
                                            Enrollment Status
                                            {getSortIcon('Enrollment Status')}
                                        </div>
                                    </th>
                                    <th className="text-left py-3 px-6 font-medium text-gray-700"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map((user, index) => (
                                    <tr key={user.id} className={index !== currentUsers.length - 1 ? 'border-b border-gray-100' : ''}>
                                        <td className="py-4 px-6 text-gray-900">{user.username}</td>
                                        <td className="py-4 px-6 text-gray-700">{user.email}</td>
                                        <td className="py-4 px-6 text-gray-700">{user.phone_number}</td>
                                        <td className="py-4 px-6 text-gray-700 font-semibold">{user.user_type}</td>
                                        <td className="py-4 px-6 text-gray-600 text-sm">{formatDate(user.created_at)}</td>
                                        <td className="py-2 px-2 text-gray-600 text-sm text-center">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-semibold ${user.is_enrolled === "PENDING"
                                                    ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                                                    : user.is_enrolled === "ENROLLED"
                                                        ? "bg-green-100 text-green-800 border border-green-300"
                                                        : "bg-gray-100 text-gray-600 border border-gray-300"
                                                    }`}
                                            >
                                                {user.is_enrolled}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <button
                                                onClick={() => setSelectedUser(user)} // assuming you manage modal state
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                View Profile
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {selectedUser && (
                        <ProfileModal
                            user={selectedUser}
                            onClose={() => setSelectedUser(null)}
                            onUpdated={() => {
                                refetch(); // optional if you refresh list
                                setSelectedUser(null);
                            }}
                        />
                    )}
                    <div className="flex justify-end mt-4 space-x-2">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border rounded text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                        >
                            Prev
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`px-3 py-1 border rounded text-sm ${currentPage === index + 1
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border rounded text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Student Form */}
            <AddStudentForm
                isOpen={showAddStudentForm}
                onClose={() => setShowAddStudentForm(false)}
                onSubmit={handleAddStudent}
            />
            <AddTeacherForm
                isOpen={showAddTeacherForm}
                onClose={() => setShowAddTeacherForm(false)}
                onSubmit={handleAddStudent}
            />
        </div>
    );
};

export default PDashboard;