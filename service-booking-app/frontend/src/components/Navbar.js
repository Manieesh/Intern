import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const accountHomePath = user?.role === 'provider' ? '/provider/dashboard' : user?.role === 'admin' ? '/admin/dashboard' : '/home';
  const providerDashboardPath = '/provider/dashboard?view=overview';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleHomeClick = () => {
    setIsOpen(false);
    navigate(accountHomePath);
    window.setTimeout(scrollToTop, 80);
  };

  const handleContactClick = () => {
    setIsOpen(false);
    navigate(accountHomePath);
    window.setTimeout(scrollToContact, 120);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/70 bg-white/85 shadow-sm backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to={isAuthenticated ? accountHomePath : '/auth-choice'} className="flex items-center gap-3">
              <img
                src="/assets/servicehub-logo.png"
                alt="ServiceHub logo"
                className="h-12 w-24 object-contain"
              />
              <span className="text-2xl font-black tracking-tight text-slate-950">ServiceHub</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-7">
            {isAuthenticated ? (
              <>
                <button onClick={handleHomeClick} className="text-sm font-semibold text-slate-700 hover:text-teal-700">
                  Home
                </button>
                <button onClick={handleContactClick} className="text-sm font-semibold text-slate-700 hover:text-teal-700">
                  Contact
                </button>
                {user?.role === 'provider' && (
                  <Link to={providerDashboardPath} className="text-sm font-semibold text-slate-700 hover:text-teal-700">
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
              </>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            {isAuthenticated && (
              <button onClick={() => setIsOpen(!isOpen)} className="text-slate-700">
                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {isAuthenticated ? (
              <>
                <button onClick={handleHomeClick} className="block w-full rounded-xl px-3 py-2 text-left font-semibold text-slate-700 hover:bg-teal-50">
                  Home
                </button>
                <button onClick={handleContactClick} className="block w-full rounded-xl px-3 py-2 text-left font-semibold text-slate-700 hover:bg-teal-50">
                  Contact
                </button>
                {user?.role === 'provider' && (
                  <Link to={providerDashboardPath} className="block rounded-xl px-3 py-2 font-semibold text-slate-700 hover:bg-teal-50">
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
              </>
            ) : null}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
