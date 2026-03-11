import { useContext } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { LogOut, LayoutDashboard, CalendarDays } from 'lucide-react';

const AdminDashboard = () => {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-gray-900 text-white min-h-screen flex flex-col">
                <div className="p-6 border-b border-gray-800">
                    <h2 className="text-2xl font-bold flex items-center">
                        <LayoutDashboard className="mr-3" />
                        Admin Panel
                    </h2>
                    <p className="text-sm text-gray-400 mt-2">ยินดีต้อนรับ, {user?.username || 'Admin'}</p>
                </div>
                
                <div className="flex-1 py-4">
                    <nav className="space-y-1">
                        <Link to="/admin" className="block px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors flex items-center">
                            <CalendarDays className="mr-3" size={20} />
                            จัดการการจอง
                        </Link>
                    </nav>
                </div>
                
                <div className="p-4 border-t border-gray-800">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
                    >
                        <LogOut className="mr-2" size={18} />
                        ออกจากระบบ
                    </button>
                    <button onClick={() => navigate('/')} className="w-full mt-3 text-sm text-gray-400 hover:text-white transition-colors">
                        กลับสู่หน้าหลัก
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <h1 className="text-xl font-semibold text-gray-800">Hotel Booking System</h1>
                    </div>
                </header>
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
