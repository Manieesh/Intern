import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiMail, FiMapPin, FiMonitor, FiMoon, FiPhone, FiSettings, FiSun, FiUser } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const navigate = useNavigate();
  const { user, selectedCity, logout } = useContext(AuthContext);
  const [themePreference, setThemePreference] = useState('light');

  useEffect(() => {
    setThemePreference(localStorage.getItem('servicehub-theme') || 'light');
  }, []);

  const changeTheme = (preference) => {
    localStorage.setItem('servicehub-theme', preference);
    setThemePreference(preference);
    window.dispatchEvent(new Event('servicehub-theme-change'));
  };

  const handleLogout = () => {
    if (!window.confirm('Are you sure you want to logout?')) return;
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#f5fbfa] px-4 py-12">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-[28px] bg-white shadow-2xl shadow-teal-50">
        <div className="bg-slate-950 px-8 py-10 text-white">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-teal-200">My Profile</p>
          <h1 className="mt-3 text-4xl font-black">Account Details</h1>
          <p className="mt-2 text-slate-300">Your ServiceHub account information.</p>
        </div>

        <div className="grid gap-5 p-8 md:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-5">
            <FiUser className="mb-3 text-2xl text-teal-700" />
            <p className="text-sm font-semibold text-slate-500">Name</p>
            <p className="mt-1 text-xl font-black text-slate-950">{user?.name || 'Not provided'}</p>
          </div>

          <div className="rounded-3xl bg-slate-50 p-5">
            <FiMail className="mb-3 text-2xl text-teal-700" />
            <p className="text-sm font-semibold text-slate-500">Email</p>
            <p className="mt-1 break-all text-xl font-black text-slate-950">{user?.email || 'Not provided'}</p>
          </div>

          <div className="rounded-3xl bg-slate-50 p-5">
            <FiPhone className="mb-3 text-2xl text-teal-700" />
            <p className="text-sm font-semibold text-slate-500">Phone</p>
            <p className="mt-1 text-xl font-black text-slate-950">{user?.phone || 'Not provided'}</p>
          </div>

          <div className="rounded-3xl bg-slate-50 p-5">
            <FiMapPin className="mb-3 text-2xl text-teal-700" />
            <p className="text-sm font-semibold text-slate-500">Selected City</p>
            <p className="mt-1 text-xl font-black text-slate-950">
              {selectedCity || user?.address?.city || 'Select city in Services'}
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 p-8">
          <div className="mb-8 rounded-3xl border border-slate-100 bg-slate-50 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xl text-teal-700 shadow-sm">
                    <FiSettings />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Settings</p>
                    <h2 className="text-xl font-black text-slate-950">Theme mode</h2>
                  </div>
                </div>
                <p className="mt-3 text-sm font-medium text-slate-500">
                  Choose Light, Dark, or follow your Windows default theme.
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-3">
                {[
                  { value: 'light', label: 'Light', icon: <FiSun /> },
                  { value: 'dark', label: 'Dark', icon: <FiMoon /> },
                  { value: 'system', label: 'Windows', icon: <FiMonitor /> }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => changeTheme(option.value)}
                    className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black transition ${
                      themePreference === option.value
                        ? 'bg-[#00BFFF] text-[#07182f] shadow-lg shadow-cyan-100'
                        : 'bg-white text-slate-600 shadow-sm hover:text-slate-950'
                    }`}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-6 py-3 font-black text-white shadow-lg shadow-red-100 transition hover:bg-red-700"
          >
            <FiLogOut />
            Logout
          </button>
          <p className="mt-3 text-sm font-medium text-slate-500">
            You will be asked to confirm before signing out.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
