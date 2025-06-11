import React from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';


const Sidebar = ({ activeItem, isOpen, onClose }) => {
    const auth = useAuthUser();
    const role = auth?.user_type;
    const navigate = useNavigate();

    const menuItems = role === "TEACHER"
  ? [
      { id: 'Tdashboard', label: 'Teacher Dashboard', path: '/teacher/dashboard' },
      { id: 'assignments', label: 'Assignments', path: '/teacher/assignment' },
    ]
  : [
      { id: 'Pdashboard', label: 'Principal Dashboard', path: '/principal/dashboard' },
      { id: 'essentials', label: 'Essentials', path: '/principal/essentials' },
      { id: 'assignments', label: 'Assignments', path: '/principal/assignment' },
      { id: 'life-skills', label: 'Life Skills', path: '/student/life-skills' },
      { id: 'reports', label: 'Reports', path: '/student/reports' },
      { id: 'settings', label: 'Settings', path: '/student/settings' }
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
                                onClick={() => navigate(item.path)}
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
                <LogoutButton />
            </nav>
        </div>
    );
};

export default Sidebar;
