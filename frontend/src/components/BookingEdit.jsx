import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { ArrowLeft, Save } from 'lucide-react';

const BookingEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/bookings/${id}`);
                setFormData(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('ไม่พบข้อมูลการจอง');
                setLoading(false);
            }
        };
        fetchBooking();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.put(`${API_URL}/api/bookings/${id}`, formData);
            navigate('/admin');
        } catch (err) {
            console.error(err);
            setError('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
    if (error && !formData) return <div className="p-6 text-center text-red-600 bg-red-50 rounded-lg m-6">{error}</div>;

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-4xl mx-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                    <button onClick={() => navigate('/admin')} className="mr-4 p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h2 className="text-xl font-bold text-gray-800">แก้ไขการจอง #{id}</h2>
                </div>
            </div>
            
            <div className="p-6">
                {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อ-นามสกุล</label>
                            <input type="text" name="fullname" required value={formData.fullname} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">อีเมล</label>
                            <input type="email" name="email" required value={formData.email} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">เบอร์โทรศัพท์</label>
                            <input type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">จำนวนผู้เข้าพัก</label>
                            <input type="number" name="guests" min="1" required value={formData.guests} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">วันเช็คอิน</label>
                            <input type="date" name="checkin" required value={formData.checkin} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">วันเช็คเอาท์</label>
                            <input type="date" name="checkout" required value={formData.checkout} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">ประเภทห้องพัก</label>
                            <select name="roomtype" value={formData.roomtype} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="standard">Standard Room</option>
                                <option value="deluxe">Deluxe Room</option>
                                <option value="suite">Suite Room</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">สถานะ</label>
                            <select name="status" value={formData.status} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-semibold shadow-sm">
                                <option value="pending" className="text-yellow-600">รอดำเนินการ</option>
                                <option value="confirmed" className="text-green-600">ยืนยันแล้ว</option>
                                <option value="cancelled" className="text-red-600">ยกเลิก</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">ความต้องการเพิ่มเติม / หมายเหตุ</label>
                            <textarea name="comment" rows="3" value={formData.comment || ''} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
                        </div>
                    </div>
                    
                    <div className="pt-6 flex justify-end space-x-3">
                        <button type="button" onClick={() => navigate('/admin')}
                            className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                            ยกเลิก
                        </button>
                        <button type="submit" disabled={saving}
                            className="px-6 py-2 border border-transparent text-white font-medium rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors flex items-center shadow-md disabled:opacity-50">
                            <Save size={18} className="mr-2" />
                            {saving ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingEdit;
