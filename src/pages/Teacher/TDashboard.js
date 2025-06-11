import React, { useState } from 'react';
import { Search, Plus, Menu, X } from 'lucide-react';
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

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
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeItem === item.id
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

  const students = [
    {
      id: 1,
      name: 'Jeremy Smith',
      plan: '90-Day Habit Transformation',
      status: 'Not Started',
      nextSession: 'Jan 28, 2025'
    },
    {
      id: 2,
      name: 'Pluto Smith',
      plan: '90-Day Habit Transformation',
      status: 'Not Started',
      nextSession: 'Jan 28, 2025'
    },
    {
      id: 3,
      name: 'Tina Smith',
      plan: '90-Day Habit Transformation',
      status: 'Not Started',
      nextSession: 'Jan 28, 2025'
    }
  ];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
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
            <p className="text-gray-600">{filteredStudents.length} Results</p>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Name</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Plan</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Next Session</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700"></th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr key={student.id} className={index !== filteredStudents.length - 1 ? 'border-b border-gray-100' : ''}>
                    <td className="py-4 px-6 text-gray-900">{student.name}</td>
                    <td className="py-4 px-6 text-gray-700">{student.plan}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {student.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-700 text-sm">
                      <div>{student.nextSession}</div>
                    </td>
                    <td className="py-4 px-6">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Go To Classroom
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TDashboard;
