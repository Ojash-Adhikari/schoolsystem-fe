// components/ProfileModal.jsx
import React, { useState } from 'react';
import axios from '../../utils/Account/axios';
import { toast } from "react-toastify";

const ProfileModal = ({ user, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({ ...user });

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
    } catch (error) {
        
      console.error("Update failed", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/users/users/${user.id}/`);
      onUpdated();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-200/90 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-lg p-6 shadow-lg w-[90%] max-w-md animate-slideUp">
        <h2 className="text-xl font-bold mb-4">User Profile</h2>

        <div className="space-y-2 text-sm">
          <div><strong>ID:</strong> {user.id}</div>
          <div><strong>Username:</strong> {user.username}</div>
          <div><strong>Email:</strong> {user.email}</div>
          <div><strong>Phone:</strong> {user.phone_number}</div>
          <div><strong>User Type:</strong> {user.user_type}</div>
          <div>
            <label className="block font-semibold">Enrollment Status:</label>
            <select
              name="is_enrolled"
              value={formData.is_enrolled}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded px-2 py-1"
            >
              <option value="PENDING">PENDING</option>
              <option value="ENROLLED">ENROLLED</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button onClick={handleUpdate} className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600">Update</button>
          <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">Delete</button>
          <button onClick={onClose} className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500">Close</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
