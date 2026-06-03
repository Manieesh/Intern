import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowRight, FiCheckCircle, FiLock, FiMail } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import GoogleLoginButton from '../components/GoogleLoginButton';

const Login = () => {
  const navigate = useNavigate();
  const { login, googleLogin } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

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
      const result = await login(formData.email, formData.password);

      if (result.success) {
        toast.success('Login successful!');
        navigate('/services');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCredential = async (credential) => {
    setLoading(true);

    try {
      const result = await googleLogin(credential);

      if (result.success) {
        toast.success('Google login successful!');
        navigate('/services');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[720px] max-w-6xl overflow-hidden rounded-[28px] bg-white shadow-2xl shadow-slate-200 lg:grid-cols-[0.95fr_1.05fr]">
        <aside className="relative hidden bg-[#0f4c5c] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_28%),radial-gradient(circle_at_80%_35%,rgba(255,255,255,0.12),transparent_24%)]" />
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-100">ServiceHub</p>
            <h1 className="mt-8 text-5xl font-black leading-tight">
              Book trusted local services without the back and forth.
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-cyan-50">
              Sign in to manage bookings, track providers, and keep every service request in one place.
            </p>
          </div>

          <div className="relative grid gap-4 rounded-2xl bg-white/10 p-5 backdrop-blur">
            {['Verified professionals', 'Secure booking flow', 'Fast customer support'].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm font-medium">
                <FiCheckCircle className="text-cyan-200" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </aside>

        <section className="flex items-center justify-center px-6 py-10 sm:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1d7874]">Welcome back</p>
              <h2 className="mt-3 text-4xl font-black text-slate-950">Sign in</h2>
              <p className="mt-2 text-slate-500">Access your account and continue booking trusted local services.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
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
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-700">Password</label>
                  <button type="button" className="text-sm font-semibold text-[#1d7874] hover:text-[#0f4c5c]">
                    Reset password
                  </button>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-[#1d7874] focus-within:bg-white focus-within:ring-4 focus-within:ring-teal-50">
                  <FiLock className="text-slate-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent text-slate-900 outline-none"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1d7874] px-5 py-3 font-bold text-white shadow-lg shadow-teal-100 transition hover:bg-[#0f4c5c] disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Sign in'}
                {!loading && <FiArrowRight />}
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <span className="h-px flex-1 bg-slate-200" />
              <span className="text-sm font-medium text-slate-500">or continue with</span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <GoogleLoginButton onCredential={handleGoogleCredential} disabled={loading} />

            <div className="mt-8 rounded-2xl bg-slate-50 px-5 py-4 text-center text-slate-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-[#1d7874] hover:text-[#0f4c5c]">
                Create one
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
