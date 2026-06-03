import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Common Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Services from './pages/Services';
import Booking from './pages/Booking';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import Profile from './pages/Profile';

// Context
import { AuthProvider, AuthContext } from './context/AuthContext';

const PrivateRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, loading } = React.useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50">
        <div className="rounded-3xl bg-white px-8 py-6 text-center shadow-xl shadow-slate-100">
          <p className="font-semibold text-slate-600">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/home" />;
  }

  return children;
};

const HomeRoute = () => {
  const { user } = React.useContext(AuthContext);

  if (user?.role === 'provider') {
    return <Navigate to="/provider/dashboard" replace />;
  }

  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Home />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="servicehub-app-background flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/home"
                element={
                  <PrivateRoute>
                    <HomeRoute />
                  </PrivateRoute>
                }
              />
              <Route
                path="/services"
                element={
                  <PrivateRoute>
                    <Services />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />

              {/* Customer Routes */}
              <Route
                path="/booking/:serviceId"
                element={
                  <PrivateRoute requiredRole="customer">
                    <Booking />
                  </PrivateRoute>
                }
              />
              <Route
                path="/bookings"
                element={
                  <PrivateRoute requiredRole="customer">
                    <MyBookings />
                  </PrivateRoute>
                }
              />

              {/* Provider Routes */}
              <Route
                path="/provider/dashboard"
                element={
                  <PrivateRoute requiredRole="provider">
                    <ProviderDashboard />
                  </PrivateRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <PrivateRoute requiredRole="admin">
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer position="bottom-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
