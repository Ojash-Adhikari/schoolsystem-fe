import React, { useState } from 'react';
import { Search, Plus, Menu, X, ChevronUp, ChevronDown } from 'lucide-react';
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import useFetchAuth from '../../utils/Account/useFetchAuth';
import axios from '../../utils/Account/axios';
import { toast } from "react-toastify";
import LogoutButton from './LogoutButton';

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
                <LogoutButton />
            </nav>
        </div>
    );
};

export default Sidebar;