import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Components
import BookingForm from './components/BookingForm';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import BookingList from './components/BookingList';
import BookingEdit from './components/BookingEdit';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<BookingForm />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminDashboard />}>
              <Route index element={<BookingList />} />
              <Route path="edit/:id" element={<BookingEdit />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
