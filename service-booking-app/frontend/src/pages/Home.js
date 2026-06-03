import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  FiArrowRight,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiMapPin,
  FiSearch,
  FiShield,
  FiStar,
  FiTrendingUp,
  FiUserCheck,
} from 'react-icons/fi';

const serviceDomains = [
  'Home Services',
  'Education Services',
  'Event Services',
  'Vehicle Services',
  'Health & Wellness',
  'Digital Services',
  'Daily Life Services',
  'Agriculture Services'
];

const serviceCards = [
  { name: 'Electrician', meta: 'Wiring, lights, switch boards', rate: 'Rs 150/hr', status: '12 online' },
  { name: 'Home Tutor', meta: 'School subjects and exam coaching', rate: 'Rs 120/hr', status: '8 online' },
  { name: 'Photographer', meta: 'Events, portraits, product shoots', rate: 'Rs 220/hr', status: '6 online' },
  { name: 'Tractor Rental', meta: 'Farm work and agriculture support', rate: 'Rs 180/hr', status: '5 online' }
];

const benefits = [
  { title: 'Verified Providers', icon: FiUserCheck, text: 'Profiles, city, category, and provider availability are checked before booking.' },
  { title: 'OTP Start', icon: FiShield, text: 'Providers can start service only after collecting the customer OTP.' },
  { title: 'Hourly Pricing', icon: FiDollarSign, text: 'Customers see rates and total amount based on selected service hours.' },
  { title: 'Live Location', icon: FiMapPin, text: 'Customers can fill address details using live location during booking.' },
  { title: 'Provider Dashboard', icon: FiBriefcase, text: 'Providers manage orders, cancellations, earnings, services, and feedback.' },
  { title: 'Anonymous Feedback', icon: FiStar, text: 'Providers can view ratings and comments without revealing customer identity.' }
];

const stats = [
  { value: 10000, suffix: '+', label: 'Happy Customers' },
  { value: 500, suffix: '+', label: 'Service Providers' },
  { value: 49, suffix: '+', label: 'Tamil Nadu Cities' },
  { value: 98, suffix: '%', label: 'Customer Satisfaction' }
];

const testimonials = [
  {
    name: 'Verified Customer',
    review: 'I booked an electrician, shared the OTP only after arrival, and the whole process felt secure.',
    tag: 'Chennai'
  },
  {
    name: 'Anonymous Provider',
    review: 'The dashboard separates pending, approved, completed, and cancelled orders clearly.',
    tag: 'Coimbatore'
  },
  {
    name: 'Verified Customer',
    review: 'The payment options, live location, and provider contact details made the booking simple.',
    tag: 'Madurai'
  }
];

const AnimatedCounter = ({ value, suffix }) => {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [count, setCount] = useState(0);

  React.useEffect(() => {
    if (!inView) return undefined;

    let frame;
    const duration = 1300;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.floor(value * progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const Home = () => {
  const providerTags = useMemo(() => ['Join as Tutor', 'Join as Electrician', 'Join as Photographer', 'Join as Plumber'], []);

  return (
    <div className="overflow-hidden text-slate-900">
      <section className="relative min-h-[calc(100vh-5rem)] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/70 px-4 py-2 text-sm font-black text-teal-800 shadow-sm backdrop-blur">
              <FiTrendingUp />
              Tamil Nadu local service network
            </div>
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-tight text-slate-950 sm:text-6xl lg:text-7xl">
              ServiceHub command center for trusted local work
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
              Find city-based providers, book by the hour, protect service starts with OTP, and manage every order from one polished MERN platform.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/services" className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-7 py-3 font-black text-white shadow-xl shadow-slate-300 transition hover:bg-teal-800">
                Find Services
                <FiArrowRight />
              </Link>
              <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/80 px-7 py-3 font-black text-slate-950 backdrop-blur transition hover:border-teal-500 hover:text-teal-800">
                Become Provider
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {['OTP protected start', 'Post and pre payment demo', 'Cancellation fee tracking', 'Anonymous feedback'].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 font-bold text-slate-700 shadow-sm backdrop-blur">
                  <FiCheckCircle className="text-teal-700" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 35 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65, delay: 0.1 }} className="relative">
            <div className="rounded-[2rem] border border-white/50 bg-slate-950/88 p-5 text-white shadow-2xl shadow-slate-300 backdrop-blur">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.24em] text-teal-200">Live Service Board</p>
                  <h2 className="mt-2 text-2xl font-black">Available now</h2>
                </div>
                <span className="rounded-full bg-emerald-400 px-3 py-1 text-xs font-black text-slate-950">Online</span>
              </div>

              <div className="space-y-3">
                {serviceCards.map((card) => (
                  <div key={card.name} className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-black">{card.name}</h3>
                        <p className="mt-1 text-sm text-slate-300">{card.meta}</p>
                      </div>
                      <p className="text-sm font-black text-teal-200">{card.rate}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-slate-300">{card.status}</span>
                      <Link to="/services" className="font-black text-teal-200 hover:text-white">Book</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/60 bg-white/75 p-5 shadow-xl shadow-slate-200 backdrop-blur">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.22em] text-teal-700">Service Domains</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {serviceDomains.map((domain) => (
              <Link key={domain} to={`/services?domain=${encodeURIComponent(domain)}`} className="rounded-2xl border border-slate-100 bg-white/80 px-4 py-4 font-black text-slate-800 transition hover:-translate-y-1 hover:border-teal-300 hover:text-teal-800 hover:shadow-lg">
                {domain}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950/95 py-20 text-white backdrop-blur">
        <div className="container">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-teal-200">How It Works</p>
            <h2 className="mt-3 text-4xl font-black">A secure local-service workflow</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              { title: 'Choose City & Service', icon: FiSearch, text: 'Customers select city first, then choose the domain and service needed.' },
              { title: 'Book With Details', icon: FiClock, text: 'Date, future time, live location, payment method, and amount are captured.' },
              { title: 'Start With OTP', icon: FiShield, text: 'Provider can start work only after collecting OTP from the customer.' }
            ].map(({ title, icon: Icon, text }, index) => (
              <motion.div key={title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-400/15 text-2xl text-teal-200">
                  <Icon />
                </div>
                <p className="text-sm font-black uppercase tracking-[0.22em] text-teal-200">Step {index + 1}</p>
                <h3 className="mt-3 text-2xl font-black">{title}</h3>
                <p className="mt-4 leading-7 text-slate-300">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-teal-700">Why ServiceHub</p>
            <h2 className="mt-3 text-4xl font-black text-slate-950">Built like a final-year MERN product, presented like a real platform</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map(({ title, icon: Icon, text }) => (
              <motion.div key={title} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl border border-white/60 bg-white/82 p-6 shadow-lg shadow-slate-200 backdrop-blur transition hover:-translate-y-1">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-700 text-xl text-white">
                  <Icon />
                </div>
                <h3 className="text-lg font-black">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950/95 py-16 text-white">
        <div className="container grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur">
              <p className="text-4xl font-black text-teal-200">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-slate-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-20">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-teal-700">Feedback</p>
          <h2 className="mt-3 text-4xl font-black text-slate-950">Trust without exposing customer identity</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.div key={`${item.name}-${item.tag}`} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="rounded-3xl border border-white/70 bg-white/86 p-6 shadow-xl shadow-slate-200 backdrop-blur">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-black">{item.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-slate-500">{item.tag}</p>
                </div>
                <div className="flex text-amber-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar key={star} fill="currentColor" />
                  ))}
                </div>
              </div>
              <p className="mt-5 leading-8 text-slate-600">"{item.review}"</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="pb-20">
        <div className="container grid items-center gap-10 rounded-[2rem] border border-white/60 bg-white/82 p-8 shadow-2xl shadow-slate-200 backdrop-blur lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-teal-700">Become a Service Provider</p>
            <h2 className="mt-4 text-4xl font-black text-slate-950 sm:text-5xl">Turn your skill into city-based earnings</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Go online by selecting your city, service category, and hourly rate. Manage approved orders, OTP starts, cancellations, and anonymous feedback.
            </p>
            <Link to="/register" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#0f766e] px-7 py-3 font-black text-white shadow-xl shadow-teal-100 transition hover:bg-[#115e59]">
              Register as Provider
              <FiArrowRight />
            </Link>
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-2">
            {providerTags.map((tag) => (
              <div key={tag} className="rounded-3xl border border-white bg-white/80 p-6 font-black text-slate-900 shadow-lg shadow-teal-100 backdrop-blur">
                <FiCheckCircle className="mb-4 text-2xl text-teal-700" />
                {tag}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
