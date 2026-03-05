import { useEffect, useState } from "react";
import axios from "axios";

function BookingManagement() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:3001/bookings");
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("ยืนยันการลบข้อมูล?")) return;

    try {
      await axios.delete(`http://localhost:3001/bookings/${id}`);
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async (booking) => {
    const newName = prompt("แก้ไขชื่อ", booking.name);

    if (!newName) return;

    try {
      await axios.put(`http://localhost:3001/bookings/${booking.id}`, {
        ...booking,
        name: newName
      });

      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>จัดการการจอง</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>ชื่อผู้จอง</th>
            <th>ห้อง</th>
            <th>จัดการ</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.name}</td>
              <td>{b.room}</td>

              <td>
                <button onClick={() => handleEdit(b)}>แก้ไข</button>
                <button onClick={() => handleDelete(b.id)}>ลบ</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookingManagement;