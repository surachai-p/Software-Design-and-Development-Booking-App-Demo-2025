import React from "react";

function ManageBookings() {
  return (
    <div>
      <h2>จัดการการจอง</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ชื่อผู้จอง</th>
            <th>ห้อง</th>
            <th>วันที่</th>
            <th>จัดการ</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>ตัวอย่าง</td>
            <td>Room A</td>
            <td>2025-03-05</td>
            <td>
              <button>แก้ไข</button>
              <button>ลบ</button>
            </td>
          </tr>
        </tbody>

      </table>
    </div>
  );
}

export default ManageBookings;