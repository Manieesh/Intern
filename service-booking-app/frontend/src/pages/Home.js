import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  FiArrowRight,
  FiAward,
  FiCamera,
  FiCheckCircle,
  FiClock,
  FiCpu,
  FiDollarSign,
  FiHome,
  FiMonitor,
  FiPhoneCall,
  FiSearch,
  FiShield,
  FiStar,
  FiTool,
  FiUserCheck,
  FiUsers,
  FiZap
} from 'react-icons/fi';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 }
  }
};

const serviceCards = [
  { name: 'Electrician', category: 'electrical', icon: FiZap, description: 'Wiring, switches, lighting, and urgent electrical repairs.' },
  { name: 'Plumber', category: 'plumbing', icon: FiTool, description: 'Leak repairs, tap fitting, drainage, and bathroom fixes.' },
  { name: 'Tutor', category: 'tutor', icon: FiAward, description: 'Qualified tutors for school, college, and skill learning.' },
  { name: 'Photographer', category: 'photographer', icon: FiCamera, description: 'Event, product, portrait, and professional shoots.' },
  { name: 'House Cleaning', category: 'cleaning', icon: FiHome, description: 'Deep cleaning for homes, kitchens, sofas, and bathrooms.' },
  { name: 'AC Repair', category: 'hvac', icon: FiClock, description: 'AC servicing, installation, gas refill, and cooling repairs.' },
  { name: 'Computer Repair', category: 'computer-repair', icon: FiMonitor, description: 'Laptop, desktop, network, and software troubleshooting.' },
  { name: 'Interior Design', category: 'interior-design', icon: FiCpu, description: 'Premium design support for homes and commercial spaces.' }
];

const benefits = [
  { title: 'Verified Professionals', icon: FiUserCheck, text: 'Every provider goes through profile, skill, and quality checks.' },
  { title: 'Secure Payments', icon: FiShield, text: 'Protected transactions and transparent booking records.' },
  { title: 'Instant Booking', icon: FiClock, text: 'Find availability and confirm a booking in minutes.' },
  { title: 'Real Reviews', icon: FiStar, text: 'Ratings from customers who actually booked the service.' },
  { title: 'Affordable Pricing', icon: FiDollarSign, text: 'Compare providers and pick the right fit for your budget.' },
  { title: '24/7 Support', icon: FiPhoneCall, text: 'Responsive support for customers and service partners.' }
];

const testimonials = [
  {
    name: 'Meera Krishnan',
    review: 'The electrician arrived on time, fixed everything neatly, and the booking flow was incredibly simple.',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=300&q=80'
  },
  {
    name: 'Vikram Rao',
    review: 'I found a photographer for my store launch in minutes. The profile, reviews, and pricing were clear.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80'
  },
  {
    name: 'Ananya Das',
    review: 'ServiceHub feels premium and reliable. The provider dashboard is perfect for my tutoring business.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'
  }
];

const stats = [
  { value: 10000, suffix: '+', label: 'Happy Customers' },
  { value: 500, suffix: '+', label: 'Service Providers' },
  { value: 25, suffix: '+', label: 'Service Categories' },
  { value: 98, suffix: '%', label: 'Customer Satisfaction' }
];

const AnimatedCounter = ({ value, suffix }) => {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [count, setCount] = useState(0);

  React.useEffect(() => {
    if (!inView) return;

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

const SectionHeading = ({ eyebrow, title, text, dark = false }) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-100px' }}
    transition={{ duration: 0.55 }}
    className="mx-auto mb-12 max-w-3xl text-center"
  >
    <p className={`text-sm font-bold uppercase tracking-[0.25em] ${dark ? 'text-teal-200' : 'text-teal-600'}`}>{eyebrow}</p>
    <h2 className={`mt-3 text-3xl font-black tracking-tight sm:text-4xl ${dark ? 'text-white' : 'text-slate-950'}`}>{title}</h2>
    {text && <p className={`mt-4 text-lg leading-8 ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{text}</p>}
  </motion.div>
);

const Home = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const providerTags = useMemo(() => ['Join as Tutor', 'Join as Electrician', 'Join as Photographer', 'Join as Plumber'], []);

  const handleSearch = (event) => {
    event.preventDefault();
    const search = query.trim();
    navigate(search ? `/services?search=${encodeURIComponent(search)}` : '/services');
  };

  return (
    <div className="overflow-hidden bg-white text-slate-900">
      <section id="home" className="relative min-h-[780px] bg-[#eef7f6]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(20,184,166,0.24),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(15,76,92,0.18),transparent_28%)]" />
        <div className="container relative grid items-center gap-12 pb-20 pt-28 lg:grid-cols-[1.05fr_0.95fr] lg:pt-36">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-semibold text-teal-800 shadow-sm backdrop-blur">
              <FiShield />
              Verified local experts at your doorstep
            </motion.div>

            <motion.h1 variants={fadeUp} className="mt-6 max-w-4xl text-5xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Book Trusted Local Services Near You
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Find verified electricians, plumbers, tutors, photographers, cleaners, and more within minutes.
            </motion.p>

            <motion.form
              variants={fadeUp}
              onSubmit={handleSearch}
              className="mt-8 flex max-w-2xl flex-col gap-3 rounded-3xl border border-white/80 bg-white/85 p-3 shadow-2xl shadow-teal-100/70 backdrop-blur md:flex-row"
            >
              <div className="flex flex-1 items-center gap-3 px-3">
                <FiSearch className="text-xl text-teal-700" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search electricians, cleaning, tutors..."
                  className="w-full bg-transparent py-3 text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
              <button className="rounded-2xl bg-[#0f766e] px-6 py-3 font-bold text-white shadow-lg shadow-teal-100 transition hover:bg-[#115e59]">
                Search
              </button>
            </motion.form>

            <motion.div variants={fadeUp} className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link to="/services" className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-7 py-3 font-bold text-white shadow-xl shadow-slate-200 transition hover:-translate-y-0.5">
                Book a Service
                <FiArrowRight />
              </Link>
              <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-full border border-teal-200 bg-white px-7 py-3 font-bold text-teal-800 shadow-lg shadow-teal-50 transition hover:-translate-y-0.5">
                Become a Provider
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-teal-300/40 to-slate-900/10 blur-2xl" />
            <div className="relative rounded-[2rem] border border-white/70 bg-white/70 p-5 shadow-2xl shadow-teal-200/60 backdrop-blur">
              <div className="overflow-hidden rounded-[1.5rem] bg-[#0f4c5c] p-6 text-white">
                <div className="grid grid-cols-[1fr_0.85fr] gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=700&q=80"
                    alt="Professional electrician helping a customer"
                    className="h-80 w-full rounded-3xl object-cover shadow-2xl"
                  />
                  <div className="space-y-4">
                    <div className="rounded-3xl bg-white/12 p-4 backdrop-blur">
                      <p className="text-sm text-cyan-100">Next booking</p>
                      <p className="mt-2 text-2xl font-black">AC Repair</p>
                      <p className="mt-1 text-sm text-cyan-50">Today, 5:30 PM</p>
                    </div>
                    <div className="rounded-3xl bg-white p-4 text-slate-900">
                      <div className="flex items-center gap-3">
                        <img
                          src="https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?auto=format&fit=crop&w=160&q=80"
                          alt="Verified service provider"
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-bold">Ravi Kumar</p>
                          <p className="text-sm text-slate-500">Verified Provider</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between rounded-2xl bg-teal-50 px-3 py-2 text-sm font-bold text-teal-800">
                        <span>4.9 rating</span>
                        <span>28 jobs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="services" className="container py-20">
        <SectionHeading
          eyebrow="Popular Services"
          title="Everything your home or business needs"
          text="High-demand service categories designed for quick discovery, clear pricing, and trusted bookings."
        />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {serviceCards.map(({ name, category, icon: Icon, description }) => (
            <motion.div key={name} variants={fadeUp}>
              <Link
                to={`/services?category=${category}`}
                className="group block h-full rounded-3xl border border-slate-100 bg-white p-6 shadow-lg shadow-slate-100 transition duration-300 hover:-translate-y-2 hover:border-teal-100 hover:shadow-2xl hover:shadow-teal-100"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-2xl text-teal-700 transition group-hover:bg-teal-700 group-hover:text-white">
                  <Icon />
                </div>
                <h3 className="text-xl font-black text-slate-950">{name}</h3>
                <p className="mt-3 leading-7 text-slate-600">{description}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="bg-slate-950 py-20 text-white">
        <div className="container">
          <SectionHeading
            eyebrow="How It Works"
            title="Book in three simple steps"
            text="A clean booking experience from search to provider confirmation."
            dark
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              { title: 'Search Service', icon: FiSearch, text: 'Enter the service you need and discover verified providers near your location.' },
              { title: 'Choose Provider', icon: FiUsers, text: 'Compare ratings, experience, pricing, and availability before selecting the right expert.' },
              { title: 'Book & Relax', icon: FiCheckCircle, text: 'Confirm your slot, pay securely, and let the professional handle the rest.' }
            ].map(({ title, icon: Icon, text }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-400/15 text-3xl text-teal-200">
                  <Icon />
                </div>
                <p className="text-sm font-black uppercase tracking-[0.25em] text-teal-200">Step {index + 1}</p>
                <h3 className="mt-3 text-2xl font-black">{title}</h3>
                <p className="mt-4 leading-7 text-slate-300">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="bg-[#f5fbfa] py-20">
        <div className="container">
          <SectionHeading
            eyebrow="Why Choose ServiceHub"
            title="Premium trust layer for local bookings"
            text="Every benefit is designed around confidence, speed, and a better service experience."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map(({ title, icon: Icon, text }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl border border-white bg-white/75 p-6 shadow-lg shadow-teal-50 backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl"
              >
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

      <section className="bg-slate-950 py-16 text-white">
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
        <SectionHeading
          eyebrow="Testimonials"
          title="Loved by customers and providers"
          text="Modern testimonial cards that communicate trust for your platform presentation."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-100"
            >
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="h-14 w-14 rounded-full object-cover" />
                <div>
                  <h3 className="font-black">{item.name}</h3>
                  <div className="mt-1 flex text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar key={star} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-5 leading-8 text-slate-600">"{item.review}"</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-[#e9f7f5] py-20">
        <div className="container grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-teal-700">Become a Service Provider</p>
            <h2 className="mt-4 text-4xl font-black text-slate-950 sm:text-5xl">Turn Your Skills Into Earnings</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Build your profile, receive local bookings, manage work, and grow your income through ServiceHub.
            </p>
            <Link to="/register" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#0f766e] px-7 py-3 font-bold text-white shadow-xl shadow-teal-100 transition hover:bg-[#115e59]">
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

      <section className="container py-20">
        <div className="rounded-[2rem] bg-slate-950 px-6 py-14 text-center text-white shadow-2xl shadow-slate-200 sm:px-12">
          <h2 className="text-4xl font-black sm:text-5xl">Ready to Book Your Next Service?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            Find trusted professionals, compare options, and confirm your booking today.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/services" className="rounded-full bg-teal-400 px-7 py-3 font-black text-slate-950 transition hover:bg-teal-300">
              Book Now
            </Link>
            <Link to="/services" className="rounded-full border border-white/20 px-7 py-3 font-black text-white transition hover:bg-white/10">
              Explore Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
