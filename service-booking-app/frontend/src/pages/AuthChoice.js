import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBriefcase, FiUser } from 'react-icons/fi';
import { USER_ROLES } from '../config/constants';

const AuthChoice = () => {
  const navigate = useNavigate();

  const chooseRole = (role) => {
    sessionStorage.setItem('authRoleChoice', role);
    navigate('/login');
  };

  const roleOptions = [
    {
      role: USER_ROLES.CUSTOMER,
      title: 'Customer',
      icon: <FiUser />,
      description: 'Looking for Services?',
      cardClass: 'border-slate-100 bg-slate-50 text-slate-950 shadow-lg shadow-slate-100',
      iconClass: 'bg-[#00BFFF]/15 text-[#007eaa]'
    },
    {
      role: USER_ROLES.SERVICE_PROVIDER,
      title: 'Provider',
      icon: <FiBriefcase />,
      description: 'Looking for Customers?',
      cardClass: 'border-slate-900 bg-slate-950 text-white shadow-2xl shadow-slate-300',
      iconClass: 'bg-[#00BFFF]/20 text-[#9fe8ff]'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f4f7fb] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[28px] bg-white p-8 shadow-2xl shadow-slate-200">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#00BFFF]">ServiceHub Access</p>
          <h1 className="mt-4 text-4xl font-black text-slate-950 sm:text-5xl">Who are you?</h1>
          <p className="mt-4 text-lg font-medium text-slate-600">
            Choose your account type before signing in or creating an account.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {roleOptions.map((option) => (
            <button
              key={option.role}
              type="button"
              onClick={() => chooseRole(option.role)}
              className={`rounded-[24px] border p-8 text-left transition hover:-translate-y-1 hover:border-[#00BFFF] ${option.cardClass}`}
            >
              <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl ${option.iconClass}`}>
                {option.icon}
              </div>
              <h2 className="text-3xl font-black">{option.title}</h2>
              <p className={`mt-3 leading-7 ${option.role === USER_ROLES.SERVICE_PROVIDER ? 'text-slate-300' : 'text-slate-600'}`}>
                {option.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthChoice;
