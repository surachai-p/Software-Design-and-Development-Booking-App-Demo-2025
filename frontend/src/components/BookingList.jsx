import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { Edit, Trash2, Eye } from 'lucide-react';

const BookingList = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/bookings`);
            setBookings(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching bookings', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('คุณต้องการลบข้อมูลการจองนี้ใช่หรือไม่?')) {
            try {
                await axios.delete(`${API_URL}/api/bookings/${id}`);
                setBookings(bookings.filter(b => b.id !== id));
            } catch (error) {
                console.error('Error deleting booking', error);
                alert('เกิดข้อผิดพลาดในการลบข้อมูล');
            }
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">รายการจองห้องพัก ({bookings.length})</h2>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รหัส</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อลูกค้า</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ห้องพัก/เข้าพัก</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เช็คอิน - เช็คเอาท์</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {bookings.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                    ยังไม่มีข้อมูลการจอง
                                </td>
                            </tr>
                        ) : (
                            bookings.map(booking => (
                                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        #{booking.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{booking.fullname}</div>
                                        <div className="text-sm text-gray-500 flex items-center mt-1">
                                            {booking.phone}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 capitalize">{booking.roomtype}</div>
                                        <div className="text-sm text-gray-500">{booking.guests} ท่าน</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{new Date(booking.checkin).toLocaleDateString('th-TH')}</div>
                                        <div className="text-sm text-gray-500">ถึง {new Date(booking.checkout).toLocaleDateString('th-TH')}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(booking.status)}`}>
                                            {booking.status === 'pending' ? 'รอดำเนินการ' : booking.status === 'confirmed' ? 'ยืนยันแล้ว' : booking.status === 'cancelled' ? 'ยกเลิก' : booking.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-2">
                                            <Link to={`/admin/edit/${booking.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="แก้ไข">
                                                <Edit size={18} />
                                            </Link>
                                            <button onClick={() => handleDelete(booking.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="ลบ">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookingList;
