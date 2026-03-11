import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-4xl font-bold text-center mb-8">ยินดีต้อนรับสู่ระบบจองห้องพัก</h1>
    <div className="text-center">
      <Link to="/booking"
        className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
        จองห้องพักเลย
      </Link>
    </div>
  </div>
);

export default HomePage;
