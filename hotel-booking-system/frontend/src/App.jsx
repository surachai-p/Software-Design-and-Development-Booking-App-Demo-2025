import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import BookingForm from "./components/BookingForm.jsx";
import BookingList from "./components/BookingList.jsx";
import BookingEdit from "./components/BookingEdit.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import Login from "./components/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import { AuthProvider, useAuth } from "./AuthContext.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />

        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/booking" element={<BookingForm />} />

          <Route path="/login" element={<Login />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute>
                <BookingList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/bookings/edit/:id"
            element={
              <ProtectedRoute>
                <BookingEdit />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

const NavBar = () => {
  const { user } = useAuth();

  return (
    <nav style={{ padding: 20, background: "#eee" }}>
      <Link to="/">หน้าแรก</Link> |{" "}
      <Link to="/booking">จองห้อง</Link> |{" "}
      {user ? <Link to="/admin">Admin</Link> : <Link to="/login">Login</Link>}
    </nav>
  );
};

const HomePage = () => {
  return (
    <div style={{ padding: 20 }}>
      <h1>Hotel Booking System</h1>
      <p>Welcome to booking system</p>
    </div>
  );
};

export default App;