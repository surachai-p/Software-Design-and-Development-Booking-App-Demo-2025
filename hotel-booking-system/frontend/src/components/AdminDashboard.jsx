import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">ระบบจัดการห้องพัก</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">ยินดีต้อนรับ: <strong>{user?.username}</strong></span>
          <button onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            ออกจากระบบ
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/bookings"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-bold mb-2">📋 จัดการการจอง</h2>
          <p className="text-gray-600">ดู แก้ไข และลบข้อมูลการจอง</p>
        </Link>
        <div className="bg-gray-100 p-6 rounded-lg shadow-sm border border-dashed border-gray-400 opacity-60">
          <h2 className="text-xl font-bold mb-2">🏨 จัดการห้องพัก</h2>
          <p className="text-gray-600">เร็วๆ นี้...</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow-sm border border-dashed border-gray-400 opacity-60">
          <h2 className="text-xl font-bold mb-2">📊 รายงาน</h2>
          <p className="text-gray-600">เร็วๆ นี้...</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
