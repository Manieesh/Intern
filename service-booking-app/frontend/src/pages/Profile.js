import React, { useContext } from 'react';
import { FiMail, FiMapPin, FiPhone, FiUser } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user, selectedCity } = useContext(AuthContext);

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
      </div>
    </div>
  );
};

export default Profile;
