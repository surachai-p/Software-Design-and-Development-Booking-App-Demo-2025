import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { Calendar, User, Phone, Mail, Users } from 'lucide-react';

const BookingForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        phone: '',
        checkin: '',
        checkout: '',
        roomtype: 'standard',
        guests: 1,
        comment: ''
    });
    const [status, setStatus] = useState({ loading: false, error: null, success: false });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: null, success: false });
        try {
            await axios.post(`${API_URL}/api/bookings`, formData);
            setStatus({ loading: false, error: null, success: true });
            setTimeout(() => {
                setFormData({
                    fullname: '', email: '', phone: '', checkin: '', checkout: '',
                    roomtype: 'standard', guests: 1, comment: ''
                });
                setStatus({ loading: false, error: null, success: false });
            }, 3000);
        } catch (error) {
            setStatus({ loading: false, error: 'เกิดข้อผิดพลาดในการจอง กรุณาลองใหม่อีกครั้ง', success: false });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">จองห้องพักออนไลน์</h1>
                    <p className="mt-4 text-lg text-gray-500">สัมผัสประสบการณ์การพักผ่อนที่ดีที่สุดกับเรา</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-8">
                        {status.success && (
                            <div className="mb-8 p-4 bg-green-50 rounded-lg text-green-800 text-center font-medium border border-green-200">
                                การจองสำเร็จ! เราจะติดต่อกลับหาคุณโดยเร็วที่สุด
                            </div>
                        )}
                        
                        {status.error && (
                            <div className="mb-8 p-4 bg-red-50 rounded-lg text-red-800 text-center font-medium border border-red-200">
                                {status.error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center"><User size={16} className="mr-2"/> ชื่อ-นามสกุล</label>
                                    <input type="text" name="fullname" required value={formData.fullname} onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center"><Mail size={16} className="mr-2"/> อีเมล</label>
                                    <input type="email" name="email" required value={formData.email} onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center"><Phone size={16} className="mr-2"/> เบอร์โทรศัพท์</label>
                                    <input type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center"><Users size={16} className="mr-2"/> จำนวนผู้เข้าพัก</label>
                                    <input type="number" name="guests" min="1" required value={formData.guests} onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center"><Calendar size={16} className="mr-2"/> วันเช็คอิน</label>
                                    <input type="date" name="checkin" required value={formData.checkin} onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center"><Calendar size={16} className="mr-2"/> วันเช็คเอาท์</label>
                                    <input type="date" name="checkout" required value={formData.checkout} onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">ประเภทห้องพัก</label>
                                    <select name="roomtype" value={formData.roomtype} onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                        <option value="standard">Standard Room</option>
                                        <option value="deluxe">Deluxe Room</option>
                                        <option value="suite">Suite Room</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">ความต้องการเพิ่มเติม</label>
                                    <textarea name="comment" rows="3" value={formData.comment} onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                                </div>
                            </div>
                            
                            <div className="pt-4 flex justify-between items-center">
                                <button type="button" onClick={() => navigate('/login')} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                    สำหรับผู้ดูแลระบบ
                                </button>
                                <button type="submit" disabled={status.loading}
                                    className="px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-md my-0 disabled:opacity-50">
                                    {status.loading ? 'กำลังดำเนินการ...' : 'ยืนยันการจองห้องพัก'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingForm;
