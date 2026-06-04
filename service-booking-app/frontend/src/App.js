import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Common Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import AuthChoice from './pages/AuthChoice';
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

const getAuthenticatedPath = (user) => {
  if (user?.role === 'provider') return '/provider/dashboard';
  if (user?.role === 'admin') return '/admin/dashboard';
  return '/home';
};

const PublicRoute = ({ children }) => {
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

  if (isAuthenticated) {
    return <Navigate to={getAuthenticatedPath(user)} replace />;
  }

  return children;
};

const HomeRoute = () => {
  const { user } = React.useContext(AuthContext);

  if (user?.role === 'provider' || user?.role === 'admin') {
    return <Navigate to={getAuthenticatedPath(user)} replace />;
  }

  return <Home />;
};

const CatchAllRoute = () => {
  const { isAuthenticated, user } = React.useContext(AuthContext);
  return <Navigate to={isAuthenticated ? getAuthenticatedPath(user) : '/auth-choice'} replace />;
};

function App() {
  React.useEffect(() => {
    const applyTheme = () => {
      const preference = localStorage.getItem('servicehub-theme') || 'light';
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const resolvedTheme = preference === 'system' ? (systemPrefersDark ? 'dark' : 'light') : preference;

      document.documentElement.dataset.theme = resolvedTheme;
      document.documentElement.dataset.themePreference = preference;
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    applyTheme();
    window.addEventListener('servicehub-theme-change', applyTheme);
    mediaQuery.addEventListener('change', applyTheme);

    return () => {
      window.removeEventListener('servicehub-theme-change', applyTheme);
      mediaQuery.removeEventListener('change', applyTheme);
    };
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="servicehub-app-background flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route
                path="/"
                element={
                  <PublicRoute>
                    <AuthChoice />
                  </PublicRoute>
                }
              />
              <Route
                path="/auth-choice"
                element={
                  <PublicRoute>
                    <AuthChoice />
                  </PublicRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />
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
              <Route path="*" element={<CatchAllRoute />} />
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
