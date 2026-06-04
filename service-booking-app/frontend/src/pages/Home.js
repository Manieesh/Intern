import React, { useContext, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiShield,
  FiZap
} from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import { USER_ROLES } from '../config/constants';

const stats = [
  { value: 10000, suffix: '+', label: 'Bookings handled' },
  { value: 500, suffix: '+', label: 'Providers onboarded' },
  { value: 49, suffix: '+', label: 'Tamil Nadu cities' },
  { value: 98, suffix: '%', label: 'Satisfaction score' }
];

const AnimatedCounter = ({ value, suffix }) => {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [count, setCount] = useState(0);

  React.useEffect(() => {
    if (!inView) return undefined;

    let frame;
    const startedAt = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - startedAt) / 1300, 1);
      setCount(Math.floor(value * progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

const Home = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const providerTags = useMemo(() => ['Tutor', 'Electrician', 'Photographer', 'Plumber'], []);

  const handleProviderRegisterClick = () => {
    const confirmed = window.confirm('Are you ready to logout and login as a provider?');
    if (!confirmed) return;

    logout();
    sessionStorage.setItem('authRoleChoice', USER_ROLES.SERVICE_PROVIDER);
    navigate('/login');
  };

  return (
    <div className="overflow-hidden text-[#07182f]">
      <section className="relative px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="absolute inset-x-0 top-0 -z-10 h-[680px] bg-[radial-gradient(circle_at_25%_10%,rgba(0,191,255,0.28),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.9),rgba(255,255,255,0.56))]" />
        <div className="mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="max-w-5xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00BFFF]/25 bg-white/80 px-4 py-2 text-sm font-black text-[#006b91] shadow-sm backdrop-blur-xl">
              <FiZap />
              ServiceHub OS for local service commerce
            </div>

            <h1 className="mt-7 max-w-5xl text-5xl font-black leading-[0.98] tracking-tight text-[#07182f] sm:text-6xl lg:text-7xl">
              Book trusted providers through a premium service platform.
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-slate-700">
              Find the Best, Forget the Rest
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/services" className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[#07182f] px-7 py-4 font-black text-white shadow-2xl shadow-[#07182f]/20 transition hover:-translate-y-0.5 hover:bg-[#0b2547]">
                Explore services
                <FiArrowRight className="transition group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-[#07182f] py-20 text-white">
        <div className="container">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#9fe8ff]">Booking Flow</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight">Steps to book services</h2>
            <p className="mt-4 text-lg leading-8 text-slate-300">
              A simple customer journey from choosing a service to completing the work securely.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Select City', icon: FiMapPin, text: 'Choose your city first so ServiceHub shows nearby providers.' },
              { title: 'Choose Service', icon: FiCheckCircle, text: 'Pick the service domain and select the exact work you need.' },
              { title: 'Book Slot', icon: FiClock, text: 'Select a valid future date, time, address, and payment method.' },
              { title: 'Share OTP', icon: FiShield, text: 'Give the OTP to the provider only when they arrive to start work.' }
            ].map(({ title, icon: Icon, text }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
                className="relative rounded-[24px] border border-white/10 bg-white/[0.07] p-6 shadow-xl shadow-black/10 backdrop-blur-xl transition hover:-translate-y-1 hover:border-[#00BFFF]/45"
              >
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#00BFFF] text-sm font-black text-[#07182f]">
                  {index + 1}
                </div>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00BFFF]/15 text-xl text-[#9fe8ff]">
                  <Icon />
                </div>
                <h3 className="text-xl font-black">{title}</h3>
                <p className="mt-3 leading-7 text-slate-300">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-[24px] border border-white/70 bg-white/88 p-6 text-center shadow-xl shadow-slate-200 backdrop-blur-xl">
              <p className="text-4xl font-black text-[#008fbd]">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 font-bold text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-20">
        <div className="container grid items-center gap-10 rounded-[28px] border border-white/70 bg-white/90 p-8 shadow-2xl shadow-slate-300 backdrop-blur-xl lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#008fbd]">Provider Growth</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">A professional console for local service businesses.</h2>
            <p className="mt-5 text-lg font-medium leading-8 text-slate-700">
              Providers go online by choosing city, job, and hourly rate. Their dashboard manages approvals, OTP start, earnings, cancellations, editable services, and anonymous feedback.
            </p>
            <button
              type="button"
              onClick={handleProviderRegisterClick}
              className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-[#07182f] px-7 py-4 font-black text-white shadow-xl shadow-[#07182f]/20 transition hover:-translate-y-0.5 hover:bg-[#0b2547]"
            >
              Register as provider
              <FiArrowRight />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {providerTags.map((tag) => (
              <div key={tag} className="rounded-[24px] border border-slate-100 bg-white p-6 font-black shadow-lg shadow-slate-100 transition hover:-translate-y-1">
                <FiCheckCircle className="mb-4 text-2xl text-[#008fbd]" />
                Join as {tag}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
