import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/70 bg-white/85 shadow-sm backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/home" className="flex items-center">
              <span className="text-2xl font-black tracking-tight text-slate-950">ServiceHub</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-7">
            {isAuthenticated ? (
              <>
                <Link to="/home" className="text-sm font-semibold text-slate-700 hover:text-teal-700">
                  Home
                </Link>
                <a href="/home#contact" className="text-sm font-semibold text-slate-700 hover:text-teal-700">
                  Contact
                </a>
                {user?.role === 'provider' && (
                  <Link to="/provider/dashboard" className="text-sm font-semibold text-slate-700 hover:text-teal-700">
                    Dashboard
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link to="/admin/dashboard" className="text-sm font-semibold text-slate-700 hover:text-teal-700">
                    Admin
                  </Link>
                )}
                {user?.role === 'customer' && (
                  <Link to="/bookings" className="text-sm font-semibold text-slate-700 hover:text-teal-700">
                    My Bookings
                  </Link>
                )}

                <Link to="/profile" className="text-sm font-semibold text-slate-700 hover:text-teal-700">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-semibold text-slate-700 hover:text-teal-700 flex items-center gap-2"
                >
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full border border-teal-200 px-5 py-2.5 text-sm font-bold text-teal-800 transition hover:bg-teal-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-200 transition hover:bg-teal-800"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-700">
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {isAuthenticated ? (
              <>
                <Link to="/home" className="block rounded-xl px-3 py-2 font-semibold text-slate-700 hover:bg-teal-50">
                  Home
                </Link>
                <a href="/home#contact" className="block rounded-xl px-3 py-2 font-semibold text-slate-700 hover:bg-teal-50">
                  Contact
                </a>
                {user?.role === 'provider' && (
                  <Link to="/provider/dashboard" className="block rounded-xl px-3 py-2 font-semibold text-slate-700 hover:bg-teal-50">
                    Dashboard
                  </Link>
                )}
                {user?.role === 'customer' && (
                  <Link to="/bookings" className="block rounded-xl px-3 py-2 font-semibold text-slate-700 hover:bg-teal-50">
                    My Bookings
                  </Link>
                )}
                <Link to="/profile" className="block rounded-xl px-3 py-2 font-semibold text-slate-700 hover:bg-teal-50">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full rounded-xl px-3 py-2 text-left font-semibold text-slate-700 hover:bg-teal-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block rounded-xl px-3 py-2 font-semibold text-slate-700 hover:bg-teal-50">
                  Login
                </Link>
                <Link to="/register" className="block rounded-xl bg-slate-950 px-3 py-2 font-semibold text-white">
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
