import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowRight, FiBriefcase, FiCheckCircle, FiLock, FiMail, FiPhone, FiUser } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import { USER_ROLES } from '../config/constants';
import GoogleLoginButton from '../components/GoogleLoginButton';

const Register = () => {
  const navigate = useNavigate();
  const { register, googleLogin } = useContext(AuthContext);
  const [role, setRole] = useState(USER_ROLES.CUSTOMER);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    category: ''
  });
  const [loading, setLoading] = useState(false);

  const getRedirectPath = (account) => {
    if (account?.role === USER_ROLES.SERVICE_PROVIDER) return '/provider/dashboard';
    if (account?.role === USER_ROLES.ADMIN) return '/admin/dashboard';
    return '/home';
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const registerData = {
        ...formData,
        role
      };

      if (role === USER_ROLES.SERVICE_PROVIDER && !formData.category) {
        toast.error('Please select a category');
        setLoading(false);
        return;
      }

      const result = await register(registerData);

      if (result.success) {
        toast.success('Registration successful!');
        navigate(getRedirectPath(result.data?.user));
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCredential = async (credential) => {
    setLoading(true);

    try {
      const result = await googleLogin(credential);

      if (result.success) {
        toast.success('Google registration successful!');
        navigate(getRedirectPath(result.data?.user));
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Google registration failed');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['plumbing', 'electrical', 'carpentry', 'painting', 'cleaning'];

  return (
    <div className="min-h-screen bg-[#f4f7fb] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[760px] max-w-6xl overflow-hidden rounded-[28px] bg-white shadow-2xl shadow-slate-200 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="flex items-center justify-center px-6 py-10 sm:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1d7874]">Start with ServiceHub</p>
              <h2 className="mt-3 text-4xl font-black text-slate-950">Create account</h2>
              <p className="mt-2 text-slate-500">Join as a customer or provider and manage services in one dashboard.</p>
            </div>

            <div className="mb-5 grid grid-cols-2 rounded-full bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setRole(USER_ROLES.CUSTOMER)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  role === USER_ROLES.CUSTOMER ? 'bg-white text-[#0f4c5c] shadow-sm' : 'text-slate-500'
                }`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => setRole(USER_ROLES.SERVICE_PROVIDER)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  role === USER_ROLES.SERVICE_PROVIDER ? 'bg-white text-[#0f4c5c] shadow-sm' : 'text-slate-500'
                }`}
              >
                Provider
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Full name</label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-[#1d7874] focus-within:bg-white focus-within:ring-4 focus-within:ring-teal-50">
                  <FiUser className="text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent text-slate-900 outline-none"
                    placeholder="Your name"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-[#1d7874] focus-within:bg-white focus-within:ring-4 focus-within:ring-teal-50">
                  <FiMail className="text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent text-slate-900 outline-none"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Phone</label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-[#1d7874] focus-within:bg-white focus-within:ring-4 focus-within:ring-teal-50">
                  <FiPhone className="text-slate-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent text-slate-900 outline-none"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-[#1d7874] focus-within:bg-white focus-within:ring-4 focus-within:ring-teal-50">
                  <FiLock className="text-slate-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full bg-transparent text-slate-900 outline-none"
                    placeholder="At least 6 characters"
                  />
                </div>
              </div>

              {role === USER_ROLES.SERVICE_PROVIDER && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Service category</label>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-[#1d7874] focus-within:bg-white focus-within:ring-4 focus-within:ring-teal-50">
                    <FiBriefcase className="text-slate-400" />
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-transparent text-slate-900 outline-none"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1d7874] px-5 py-3 font-bold text-white shadow-lg shadow-teal-100 transition hover:bg-[#0f4c5c] disabled:opacity-60"
              >
                {loading ? 'Creating account...' : 'Create account'}
                {!loading && <FiArrowRight />}
              </button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <span className="h-px flex-1 bg-slate-200" />
              <span className="text-sm font-medium text-slate-500">or continue with</span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <GoogleLoginButton onCredential={handleGoogleCredential} disabled={loading} />

            <div className="mt-7 rounded-2xl bg-slate-50 px-5 py-4 text-center text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#1d7874] hover:text-[#0f4c5c]">
                Sign in
              </Link>
            </div>
          </div>
        </section>

        <aside className="relative hidden bg-[#0f4c5c] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(255,255,255,0.18),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.12),transparent_26%)]" />
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-100">For every booking</p>
            <h1 className="mt-8 text-5xl font-black leading-tight">
              One account for finding help or growing your service business.
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-cyan-50">
              Customers get simple booking. Providers get a focused dashboard to manage work.
            </p>
          </div>

          <div className="relative grid gap-4 rounded-2xl bg-white/10 p-5 backdrop-blur">
            {['Customer and provider roles', 'Protected account access', 'Local service categories'].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm font-medium">
                <FiCheckCircle className="text-cyan-200" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Register;
