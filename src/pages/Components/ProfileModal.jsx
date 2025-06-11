// components/ProfileModal.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../utils/Account/axios';
import { toast } from "react-toastify";

const ProfileModal = ({ user, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({ ...user });
  const [isVisible, setIsVisible] = useState(false);

  // Trigger entrance animation
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/users/users/${user.id}/`, formData);
      onUpdated();
      toast.success("User Updated successfully.");
    } catch (error) {
      toast.error("Unexpected error Occurred");
      console.error("Update failed", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/users/users/${user.id}/`);
      onUpdated();
      toast.success("User Deleted successfully.");
    } catch (error) {
      toast.error("Unexpected error Occurred");
      console.error("Delete failed", error);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  return (
    <div 
      className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`bg-white rounded-xl p-8 shadow-2xl w-[90%] max-w-md border border-gray-100 transition-all duration-300 transform ${
          isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 animate-pulse">User Profile</h2>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 hover:rotate-90 transform"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {[
            { label: 'ID', value: user.id },
            { label: 'Username', value: user.username },
            { label: 'Email', value: user.email },
            { label: 'Phone', value: user.phone_number },
            { label: 'User Type', value: user.user_type }
          ].map(({ label, value }, index) => (
            <div 
              key={label}
              className={`bg-gray-50 rounded-lg p-3 transition-all duration-300 hover:bg-gray-100 hover:shadow-sm transform hover:-translate-y-0.5 ${
                isVisible ? 'animate-slideInLeft' : ''
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700">{label}:</span>
                <span className="text-gray-900 font-mono text-sm bg-white px-2 py-1 rounded border">
                  {value}
                </span>
              </div>
            </div>
          ))}

          <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-400 transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5 ${
            isVisible ? 'animate-slideInLeft' : ''
          }`} style={{ animationDelay: '250ms' }}>
            <label className="block font-semibold text-gray-700 mb-2">
              Enrollment Status:
            </label>
            <select
              name="is_enrolled"
              value={formData.is_enrolled}
              onChange={handleChange}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 hover:border-gray-300 bg-white shadow-sm"
            >
              <option value="PENDING">🟡 PENDING</option>
              <option value="ENROLLED">🟢 ENROLLED</option>
            </select>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <button 
            onClick={handleUpdate} 
            className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
          >
            <span className="flex items-center space-x-2">
              <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Update</span>
            </span>
          </button>
          
          <button 
            onClick={handleDelete} 
            className="group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
          >
            <span className="flex items-center space-x-2">
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Delete</span>
            </span>
          </button>
          
          <button 
            onClick={handleClose} 
            className="group bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
          >
            <span className="flex items-center space-x-2">
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Close</span>
            </span>
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ProfileModal;