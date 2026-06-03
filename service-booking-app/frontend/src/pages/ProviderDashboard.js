import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI, bookingAPI, reviewAPI, serviceAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const emptyServiceForm = {
  name: '',
  description: '',
  category: '',
  basePrice: '',
  estimatedDuration: ''
};

const serviceCategories = [
  'electrician',
  'plumber',
  'carpenter',
  'painter',
  'ac-repair-installation',
  'ro-water-purifier-service',
  'cctv-installation',
  'appliance-repair',
  'home-cleaning',
  'pest-control',
  'home-tutor',
  'online-tutor',
  'spoken-english-trainer',
  'computer-classes',
  'music-teacher',
  'dance-instructor',
  'exam-coaching',
  'photographer',
  'videographer',
  'dj',
  'decorator',
  'caterer',
  'makeup-artist',
  'mehendi-artist',
  'event-planner',
  'bike-mechanic',
  'car-mechanic',
  'car-wash',
  'towing-service',
  'driving-instructor',
  'vehicle-rental',
  'fitness-trainer',
  'yoga-instructor',
  'physiotherapist',
  'dietician',
  'home-nurse',
  'elder-care-assistant',
  'web-developer',
  'graphic-designer',
  'video-editor',
  'social-media-manager',
  'content-writer',
  'digital-marketing-expert',
  'laundry-pickup',
  'house-shifting-helper',
  'delivery-person',
  'gardening-service',
  'pet-care',
  'security-guard',
  'tractor-rental',
  'farm-labor-booking',
  'borewell-services',
  'irrigation-setup',
  'agricultural-consultant',
  'plumbing',
  'electrical',
  'carpentry',
  'painting',
  'cleaning',
  'landscaping',
  'pest-control',
  'hvac',
  'appliance-repair',
  'locksmith'
];

const categoryLabels = {
  electrician: 'Electrician',
  plumber: 'Plumber',
  carpenter: 'Carpenter',
  painter: 'Painter',
  'ac-repair-installation': 'AC Repair & Installation',
  'ro-water-purifier-service': 'RO Water Purifier Service',
  'cctv-installation': 'CCTV Installation',
  'appliance-repair': 'Appliance Repair',
  'home-cleaning': 'Home Cleaning',
  'pest-control': 'Pest Control',
  'home-tutor': 'Home Tutor',
  'online-tutor': 'Online Tutor',
  'spoken-english-trainer': 'Spoken English Trainer',
  'computer-classes': 'Computer Classes',
  'music-teacher': 'Music Teacher',
  'dance-instructor': 'Dance Instructor',
  'exam-coaching': 'Exam Coaching',
  photographer: 'Photographer',
  videographer: 'Videographer',
  dj: 'DJ',
  decorator: 'Decorator',
  caterer: 'Caterer',
  'makeup-artist': 'Makeup Artist',
  'mehendi-artist': 'Mehendi Artist',
  'event-planner': 'Event Planner',
  'bike-mechanic': 'Bike Mechanic',
  'car-mechanic': 'Car Mechanic',
  'car-wash': 'Car Wash',
  'towing-service': 'Towing Service',
  'driving-instructor': 'Driving Instructor',
  'vehicle-rental': 'Vehicle Rental',
  'fitness-trainer': 'Fitness Trainer',
  'yoga-instructor': 'Yoga Instructor',
  physiotherapist: 'Physiotherapist',
  dietician: 'Dietician',
  'home-nurse': 'Home Nurse',
  'elder-care-assistant': 'Elder Care Assistant',
  'web-developer': 'Web Developer',
  'graphic-designer': 'Graphic Designer',
  'video-editor': 'Video Editor',
  'social-media-manager': 'Social Media Manager',
  'content-writer': 'Content Writer',
  'digital-marketing-expert': 'Digital Marketing Expert',
  'laundry-pickup': 'Laundry Pickup',
  'house-shifting-helper': 'House Shifting Helper',
  'delivery-person': 'Delivery Person',
  'gardening-service': 'Gardening Service',
  'pet-care': 'Pet Care',
  'security-guard': 'Security Guard',
  'tractor-rental': 'Tractor Rental',
  'farm-labor-booking': 'Farm Labor Booking',
  'borewell-services': 'Borewell Services',
  'irrigation-setup': 'Irrigation Setup',
  'agricultural-consultant': 'Agricultural Consultant',
  plumbing: 'Plumber',
  electrical: 'Electrician',
  carpentry: 'Carpenter',
  painting: 'Painter',
  cleaning: 'Home Cleaning',
  landscaping: 'Gardening Service',
  hvac: 'AC Repair & Installation',
  locksmith: 'Locksmith'
};

const getErrorMessage = (error, fallback) => {
  const validationMessage = error?.response?.data?.errors?.[0]?.msg;
  return validationMessage || error?.response?.data?.error || error?.response?.data?.message || error?.message || fallback;
};

const normalizeHourlyRate = (value) => {
  const rate = Number(value);
  if (!Number.isFinite(rate) || rate <= 0) return 100;
  return Math.min(250, Math.max(25, Math.round(rate)));
};

const tamilNaduCities = [
  'Ariyalur',
  'Avadi',
  'Chengalpattu',
  'Chennai',
  'Coimbatore',
  'Cuddalore',
  'Dharmapuri',
  'Dindigul',
  'Erode',
  'Hosur',
  'Kallakurichi',
  'Kanchipuram',
  'Kanyakumari',
  'Karur',
  'Kodaikanal',
  'Krishnagiri',
  'Kumbakonam',
  'Madurai',
  'Mayiladuthurai',
  'Nagapattinam',
  'Namakkal',
  'Nagercoil',
  'Nilgiris',
  'Ooty',
  'Perambalur',
  'Pollachi',
  'Pudukkottai',
  'Rajapalayam',
  'Ramanathapuram',
  'Ranipet',
  'Rameswaram',
  'Salem',
  'Sivaganga',
  'Sivakasi',
  'Tambaram',
  'Tenkasi',
  'Thanjavur',
  'Theni',
  'Thoothukudi',
  'Tiruchirappalli',
  'Tirunelveli',
  'Tirupathur',
  'Tiruppur',
  'Tiruvallur',
  'Tiruvannamalai',
  'Tiruvarur',
  'Vellore',
  'Viluppuram',
  'Virudhunagar'
];

const orderFilterOptions = [
  { key: 'all', label: 'All Orders', statuses: [] },
  { key: 'pending', label: 'Pending Orders', statuses: ['pending'] },
  { key: 'approved', label: 'Approved Orders', statuses: ['confirmed'] },
  { key: 'in-progress', label: 'In Progress Orders', statuses: ['in-progress'] },
  { key: 'completed', label: 'Completed Orders', statuses: ['completed'] },
  { key: 'cancelled', label: 'Cancelled Orders', statuses: ['cancelled'] }
];

const getStatusBadgeClass = (status) => {
  if (status === 'completed') return 'bg-green-100 text-green-800';
  if (status === 'cancelled') return 'bg-red-100 text-red-800';
  if (status === 'pending') return 'bg-yellow-100 text-yellow-800';
  if (status === 'confirmed') return 'bg-blue-100 text-blue-800';
  if (status === 'in-progress') return 'bg-purple-100 text-purple-800';
  return 'bg-slate-100 text-slate-700';
};

const canProviderViewCustomerContact = (status) => !['pending', 'cancelled'].includes(status);

const ProviderDashboard = () => {
  const { user, saveUser } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const providerView = searchParams.get('view') === 'overview' ? 'overview' : 'home';
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedBookings: 0,
    totalServices: 0,
    totalEarnings: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');
  const [activeOrderFilter, setActiveOrderFilter] = useState('all');
  const [expandedBookingId, setExpandedBookingId] = useState(null);
  const [otpBookingId, setOtpBookingId] = useState(null);
  const [serviceOtpInput, setServiceOtpInput] = useState('');
  const [isOnline, setIsOnline] = useState(!!user?.isOnline);
  const [onlineForm, setOnlineForm] = useState({
    city: user?.address?.city || '',
    category: user?.category || '',
    hourlyRate: ''
  });
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [serviceForm, setServiceForm] = useState(emptyServiceForm);
  const setupSteps = [
    { label: 'Choose city', done: !!onlineForm.city },
    { label: 'Select job', done: !!onlineForm.category },
    { label: 'Set hourly rate', done: !!onlineForm.hourlyRate || services.length > 0 }
  ];
  const orderCounts = orderFilterOptions.reduce((counts, option) => {
    counts[option.key] = option.statuses.length === 0
      ? bookings.length
      : bookings.filter((booking) => option.statuses.includes(booking.status)).length;
    return counts;
  }, {});
  const activeOrderOption = orderFilterOptions.find((option) => option.key === activeOrderFilter) || orderFilterOptions[0];
  const filteredBookings = activeOrderOption.statuses.length === 0
    ? bookings
    : bookings.filter((booking) => activeOrderOption.statuses.includes(booking.status));

  useEffect(() => {
    setIsOnline(!!user?.isOnline);
    setOnlineForm({
      city: user?.address?.city || '',
      category: user?.category || '',
      hourlyRate: ''
    });
  }, [user]);

  const fetchProviderData = useCallback(async () => {
    setLoading(true);
    try {
      const providerId = user?._id || user?.id;
      const [bookingsRes, servicesRes, reviewsRes] = await Promise.all([
        bookingAPI.getProviderBookings(),
        serviceAPI.getProviderServices(providerId),
        reviewAPI.getProviderReviews(providerId)
      ]);

      const providerBookings = bookingsRes.data.bookings || [];
      const providerServices = servicesRes.data.services || [];
      const providerReviews = reviewsRes.data.reviews || [];

      setBookings(providerBookings);
      setServices(providerServices);
      setReviews(providerReviews);
      setAverageRating(reviewsRes.data.averageRating || 0);

      const completedBookings = providerBookings.filter((booking) => booking.status === 'completed');
      const cancellationEarnings = providerBookings
        .filter((booking) => booking.status === 'cancelled')
        .reduce((sum, booking) => sum + (booking.providerCancellationEarning || 0), 0);

      setStats({
        totalBookings: providerBookings.length,
        completedBookings: completedBookings.length,
        totalServices: providerServices.length,
        totalEarnings: completedBookings.reduce((sum, booking) => sum + booking.totalAmount, 0) + cancellationEarnings
      });
    } catch (error) {
      toast.error('Failed to fetch provider data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProviderData();
  }, [fetchProviderData]);

  const handleUpdateStatus = async (bookingId, status, extraData = {}) => {
    try {
      await bookingAPI.updateBookingStatus(bookingId, { status, ...extraData });
      toast.success('Booking status updated');
      setOtpBookingId(null);
      setServiceOtpInput('');
      fetchProviderData();
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Failed to update booking status');
    }
  };

  const handleStartWithOtp = (bookingId) => {
    if (!serviceOtpInput.trim()) {
      toast.error('Enter customer OTP to start service');
      return;
    }

    handleUpdateStatus(bookingId, 'in-progress', { serviceOtp: serviceOtpInput.trim() });
  };

  const handleProviderCancelBooking = async (booking) => {
    const cancellationCharge = Math.round((booking.totalAmount * 20) / 100);
    const confirmed = window.confirm(
      `Cancel this order? A cancellation fee of Rs ${cancellationCharge} will be applied and credited to your provider earnings.`
    );

    if (!confirmed) return;

    try {
      await bookingAPI.cancelBooking(booking._id, { reason: 'Cancelled by provider' });
      toast.success(`Order cancelled. Rs ${cancellationCharge} cancellation fee added to provider earnings.`);
      fetchProviderData();
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data?.error || 'Failed to cancel order');
    }
  };

  const formatBookingAddress = (address) => {
    if (!address) return 'Address not provided';
    return [address.street, address.city, address.state, address.zipCode].filter(Boolean).join(', ') || 'Address not provided';
  };

  const handleAvailabilityToggle = async () => {
    const nextStatus = !isOnline;

    if (nextStatus && (!onlineForm.city || !onlineForm.category)) {
      toast.error('Select your city and job before going online');
      return;
    }

    if (nextStatus && !onlineForm.hourlyRate && services.length === 0) {
      toast.error('Enter your hourly rate before going online');
      return;
    }

    if (nextStatus && onlineForm.hourlyRate && (Number(onlineForm.hourlyRate) < 25 || Number(onlineForm.hourlyRate) > 250)) {
      toast.error('Hourly rate must be between Rs 25 and Rs 250');
      return;
    }

    try {
      const response = await authAPI.updateProviderAvailability({
        isOnline: nextStatus,
        category: onlineForm.category,
        city: onlineForm.city,
        hourlyRate: normalizeHourlyRate(onlineForm.hourlyRate || 100)
      });

      if (response.data?.user) {
        saveUser(response.data.user);
      }

      setIsOnline(nextStatus);
      toast.success(nextStatus ? `You are now online in ${onlineForm.city}` : 'You are now offline');
      fetchProviderData();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update availability'));
    }
  };

  const startEditService = (service) => {
    setEditingServiceId(service._id);
    setServiceForm({
      name: service.name || '',
      description: service.description || '',
      category: service.category || '',
      basePrice: service.basePrice || '',
      estimatedDuration: service.estimatedDuration?.value || ''
    });
  };

  const cancelEditService = () => {
    setEditingServiceId(null);
    setServiceForm(emptyServiceForm);
  };

  const handleServiceFormChange = (event) => {
    setServiceForm({
      ...serviceForm,
      [event.target.name]: event.target.value
    });
  };

  const saveServiceEdit = async (service) => {
    if (!serviceForm.name || !serviceForm.description || !serviceForm.category || !serviceForm.basePrice || !serviceForm.estimatedDuration) {
      toast.error('Fill all service fields before saving');
      return;
    }

    if (Number(serviceForm.basePrice) < 25 || Number(serviceForm.basePrice) > 250) {
      toast.error('Hourly rate must be between Rs 25 and Rs 250');
      return;
    }

    try {
      await serviceAPI.updateService(service._id, {
        name: serviceForm.name,
        description: serviceForm.description,
        category: serviceForm.category,
        basePrice: Number(serviceForm.basePrice),
        estimatedDuration: {
          value: Number(serviceForm.estimatedDuration),
          unit: service.estimatedDuration?.unit || 'hours'
        }
      });

      toast.success('Service updated');
      cancelEditService();
      fetchProviderData();
    } catch (error) {
      toast.error('Failed to update service');
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f5fbfa] py-8">
      <div className="max-w-7xl mx-auto px-4">
        {providerView === 'home' && (
          <section className="mb-8 overflow-hidden rounded-[28px] bg-slate-950 text-white shadow-2xl shadow-slate-200">
            <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="relative p-6 sm:p-8 lg:p-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(45,212,191,0.28),transparent_30%),radial-gradient(circle_at_80%_75%,rgba(255,255,255,0.12),transparent_26%)]" />
                <div className="relative">
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold">
                    <span className={`h-2.5 w-2.5 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-slate-400'}`} />
                    {isOnline ? 'You are online and visible to customers' : 'Complete setup to go online'}
                  </div>
                  <p className="text-sm font-black uppercase tracking-[0.28em] text-teal-200">Provider Workspace</p>
                  <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">Manage orders from one clean dashboard</h1>
                  <p className="mt-4 max-w-xl text-slate-300">
                    Set your city, job, and hourly rate before going online. Customers in the selected city can then find and book your service.
                  </p>
                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    {setupSteps.map((step, index) => (
                      <div key={step.label} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                        <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-full text-sm font-black ${
                          step.done ? 'bg-teal-300 text-slate-950' : 'bg-white/10 text-slate-300'
                        }`}>
                          {step.done ? 'OK' : index + 1}
                        </div>
                        <p className="text-sm font-bold">{step.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 text-slate-950 sm:p-8 lg:p-10">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-black">Go Online Setup</h2>
                  <p className="mt-1 text-sm text-slate-500">Update these details anytime before accepting work.</p>
                </div>
                <span className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-black ${
                  isOnline ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  <span className={`h-2.5 w-2.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>

              <div className="grid gap-4">
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">1. Service City</label>
                  <select
                    value={onlineForm.city}
                    onChange={(event) => setOnlineForm({ ...onlineForm, city: event.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-50"
                  >
                    <option value="">Select Tamil Nadu city</option>
                    {tamilNaduCities.map((cityName) => (
                      <option key={cityName} value={cityName}>
                        {cityName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">2. Job Category</label>
                  <select
                    value={onlineForm.category}
                    onChange={(event) => setOnlineForm({ ...onlineForm, category: event.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-50"
                  >
                    <option value="">Select your job</option>
                    {serviceCategories.map((category) => (
                      <option key={category} value={category}>
                        {categoryLabels[category] || category.replace(/-/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">3. Hourly Rate</label>
                  <input
                    type="number"
                    min="25"
                    max="250"
                    value={onlineForm.hourlyRate}
                    onChange={(event) => setOnlineForm({ ...onlineForm, hourlyRate: event.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-50"
                    placeholder={services.length > 0 ? 'Leave blank to use existing rate' : 'Enter Rs 25-250/hr'}
                  />
                  <p className="mt-2 text-xs text-slate-500">This rate is used to calculate customer booking amount by selected hours.</p>
                </div>
              </div>

              <button
                onClick={handleAvailabilityToggle}
                className={`mt-6 w-full rounded-2xl px-5 py-3 text-sm font-black text-white shadow-lg transition ${
                  isOnline
                    ? 'bg-slate-800 shadow-slate-200 hover:bg-slate-900'
                    : 'bg-teal-600 shadow-teal-100 hover:bg-teal-700'
                }`}
              >
                {isOnline ? 'Go Offline' : 'Go Online'}
              </button>
              </div>
            </div>
          </section>
        )}

        {providerView === 'overview' && (
          <>
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-teal-700">Dashboard Overview</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">Orders, services, and earnings</h2>
          </div>
          <p className="text-sm font-semibold text-slate-500">
            Signed in as {user?.businessName || user?.name || 'Provider'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-4 mb-8">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-slate-500">Total Services</p>
            <p className="mt-2 text-3xl font-black text-slate-950">{stats.totalServices}</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-slate-500">Customer Orders</p>
            <p className="mt-2 text-3xl font-black text-slate-950">{stats.totalBookings}</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-slate-500">Completed Orders</p>
            <p className="mt-2 text-3xl font-black text-emerald-600">{stats.completedBookings}</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-slate-500">Total Earnings</p>
            <p className="mt-2 text-3xl font-black text-slate-950">Rs {stats.totalEarnings.toLocaleString()}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">Includes completed orders and cancellation charges</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:col-span-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-slate-500">Anonymous Customer Feedback</p>
                <p className="mt-2 text-3xl font-black text-amber-500">{averageRating || 0} / 5</p>
              </div>
              <p className="text-sm font-semibold text-slate-500">{reviews.length} review{reviews.length === 1 ? '' : 's'} received</p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex border-b border-slate-100 bg-slate-50">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-6 py-4 font-bold ${
                activeTab === 'bookings'
                  ? 'border-b-2 border-teal-600 bg-white text-teal-700'
                  : 'text-slate-600'
              }`}
            >
              Customer Orders ({stats.totalBookings})
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`px-6 py-4 font-bold ${
                activeTab === 'services'
                  ? 'border-b-2 border-teal-600 bg-white text-teal-700'
                  : 'text-slate-600'
              }`}
            >
              Services ({stats.totalServices})
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`px-6 py-4 font-bold ${
                activeTab === 'feedback'
                  ? 'border-b-2 border-teal-600 bg-white text-teal-700'
                  : 'text-slate-600'
              }`}
            >
              Feedback ({reviews.length})
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'bookings' && (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
                  {orderFilterOptions.map((option) => (
                    <button
                      key={option.key}
                      onClick={() => setActiveOrderFilter(option.key)}
                      className={`rounded-2xl border px-4 py-3 text-left transition ${
                        activeOrderFilter === option.key
                          ? 'border-teal-500 bg-teal-50 text-teal-800 shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-teal-200'
                      }`}
                    >
                      <p className="text-xs font-black uppercase tracking-wide">{option.label}</p>
                      <p className="mt-1 text-2xl font-black">{orderCounts[option.key] || 0}</p>
                    </button>
                  ))}
                </div>

                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <div key={booking._id} className="border rounded-lg p-4">
                      {(() => {
                        const canViewContact = canProviderViewCustomerContact(booking.status);
                        return (
                          <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Customer</p>
                          <p className="font-semibold">{booking.customerId?.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Service</p>
                          <p className="font-semibold">{booking.serviceId?.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Amount</p>
                          <p className="font-semibold">Rs {booking.totalAmount}</p>
                          {booking.status === 'cancelled' && (
                            <p className="text-xs font-semibold text-red-600">
                              Cancellation earning: Rs {booking.providerCancellationEarning || 0}
                            </p>
                          )}
                        </div>
                      </div>
                      {expandedBookingId === booking._id && (
                        <div className="mb-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                          <p className="mb-3 text-sm font-black uppercase tracking-wide text-slate-500">Order Details</p>
                          <div className="grid gap-3 text-sm md:grid-cols-2">
                            <div>
                              <p className="text-slate-500">Booking ID</p>
                              <p className="font-semibold text-slate-900">{booking.bookingNumber}</p>
                            </div>
                            <div>
                              <p className="text-slate-500">Customer Phone</p>
                              <p className="font-semibold text-slate-900">
                                {canViewContact ? booking.customerId?.phone || 'Not provided' : 'Visible after accepting order'}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-500">Customer Email</p>
                              <p className="font-semibold text-slate-900">
                                {canViewContact ? booking.customerId?.email || 'Not provided' : 'Visible after accepting order'}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-500">Scheduled Date</p>
                              <p className="font-semibold text-slate-900">{new Date(booking.scheduledDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-slate-500">Time</p>
                              <p className="font-semibold text-slate-900">{booking.timeSlot?.start} - {booking.timeSlot?.end}</p>
                            </div>
                            <div>
                              <p className="text-slate-500">Payment Method</p>
                              <p className="font-semibold capitalize text-slate-900">
                                {booking.paymentDetails?.method === 'prepaid' ? 'Pre Payment' : 'Post Payment'}
                              </p>
                            </div>
                            <div className="md:col-span-2">
                              <p className="text-slate-500">Service Address</p>
                              <p className="font-semibold text-slate-900">
                                {canViewContact ? formatBookingAddress(booking.bookingAddress) : 'Visible after accepting order'}
                              </p>
                            </div>
                            {booking.notes && (
                              <div className="md:col-span-2">
                                <p className="text-slate-500">Customer Notes</p>
                                <p className="font-semibold text-slate-900">{booking.notes}</p>
                              </div>
                            )}
                            {booking.status === 'cancelled' && (
                              <div className="md:col-span-2">
                                <p className="text-slate-500">Cancellation Fee</p>
                                <p className="font-semibold text-red-600">Rs {booking.cancellationCharge || 0}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadgeClass(booking.status)}`}>
                          {booking.status === 'confirmed' ? 'approved' : booking.status}
                        </span>
                        <button
                          onClick={() => setExpandedBookingId(expandedBookingId === booking._id ? null : booking._id)}
                          className="text-sm font-semibold text-slate-700 hover:text-teal-700"
                        >
                          {expandedBookingId === booking._id ? 'Hide Details' : 'View Details'}
                        </button>
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateStatus(booking._id, 'confirmed')}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Accept
                          </button>
                        )}
                        {booking.status === 'confirmed' && (
                          <>
                            <button
                              onClick={() => {
                                setOtpBookingId(booking._id);
                                setServiceOtpInput('');
                              }}
                              className="text-sm text-green-600 hover:text-green-800"
                            >
                              Start Service with OTP
                            </button>
                            {otpBookingId === booking._id && (
                              <div className="mt-3 flex w-full flex-col gap-2 rounded-2xl border border-green-100 bg-green-50 p-3 sm:flex-row sm:items-center">
                                <input
                                  value={serviceOtpInput}
                                  onChange={(event) => setServiceOtpInput(event.target.value.replace(/\D/g, '').slice(0, 6))}
                                  className="rounded-xl border border-green-200 px-3 py-2 text-sm font-semibold tracking-[0.25em] outline-none focus:border-green-500"
                                  placeholder="Enter OTP"
                                />
                                <button
                                  onClick={() => handleStartWithOtp(booking._id)}
                                  className="rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700"
                                >
                                  Verify & Start
                                </button>
                                <button
                                  onClick={() => {
                                    setOtpBookingId(null);
                                    setServiceOtpInput('');
                                  }}
                                  className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100"
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                          </>
                        )}
                        {booking.status === 'in-progress' && (
                          <button
                            onClick={() => handleUpdateStatus(booking._id, 'completed')}
                            className="text-sm text-green-600 hover:text-green-800"
                          >
                            Complete
                          </button>
                        )}
                        {!['completed', 'cancelled'].includes(booking.status) && (
                          <button
                            onClick={() => handleProviderCancelBooking(booking)}
                            className="text-sm font-semibold text-red-600 hover:text-red-800"
                          >
                            Cancel Order (20% fee)
                          </button>
                        )}
                      </div>
                          </>
                        );
                      })()}
                    </div>
                  ))
                ) : (
                  <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-gray-600">
                    No {activeOrderOption.label.toLowerCase()} found
                  </p>
                )}
              </div>
            )}

            {activeTab === 'services' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.length > 0 ? (
                  services.map((service) => (
                    <div key={service._id} className="border rounded-lg p-4">
                      {editingServiceId === service._id ? (
                        <div className="space-y-3">
                          <input
                            name="name"
                            value={serviceForm.name}
                            onChange={handleServiceFormChange}
                            className="w-full rounded border px-3 py-2"
                            placeholder="Service name"
                          />
                          <textarea
                            name="description"
                            value={serviceForm.description}
                            onChange={handleServiceFormChange}
                            className="w-full rounded border px-3 py-2"
                            rows="3"
                            placeholder="Service description"
                          />
                          <select
                            name="category"
                            value={serviceForm.category}
                            onChange={handleServiceFormChange}
                            className="w-full rounded border px-3 py-2 capitalize"
                          >
                            <option value="">Select job category</option>
                            {serviceCategories.map((category) => (
                              <option key={category} value={category}>
                                {categoryLabels[category] || category.replace(/-/g, ' ')}
                              </option>
                            ))}
                          </select>
                          <div className="grid gap-3 md:grid-cols-2">
                            <input
                              name="basePrice"
                              type="number"
                              min="25"
                              max="250"
                              value={serviceForm.basePrice}
                              onChange={handleServiceFormChange}
                              className="w-full rounded border px-3 py-2"
                              placeholder="Hourly rate"
                            />
                            <input
                              name="estimatedDuration"
                              type="number"
                              value={serviceForm.estimatedDuration}
                              onChange={handleServiceFormChange}
                              className="w-full rounded border px-3 py-2"
                              placeholder="Duration"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveServiceEdit(service)}
                              className="rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEditService}
                              className="rounded bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <h4 className="font-semibold text-lg">{service.name}</h4>
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {isOnline ? 'Online' : 'Offline'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{service.description.substring(0, 100)}...</p>
                          <div className="space-y-1 text-sm mb-3">
                            <p><strong>Category:</strong> {service.category}</p>
                            <p><strong>City:</strong> {user?.address?.city || 'Not set'}</p>
                            <p><strong>Hourly Rate:</strong> Rs {service.basePrice}/hour</p>
                            <p><strong>Rating:</strong> {service.rating} ({service.totalReviews} reviews)</p>
                            <p><strong>Bookings:</strong> {service.totalBookings}</p>
                          </div>
                          <button
                            onClick={() => startEditService(service)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Edit Service
                          </button>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No services yet. Create one to get started!</p>
                )}
              </div>
            )}

            {activeTab === 'feedback' && (
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review._id} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-black uppercase tracking-wide text-slate-500">Anonymous Customer</p>
                          <p className="mt-1 text-sm font-semibold text-slate-500">
                            Service: {review.serviceId?.name || 'Service'}
                          </p>
                        </div>
                        <div className="rounded-full bg-amber-100 px-4 py-2 text-sm font-black text-amber-700">
                          {review.rating} / 5
                        </div>
                      </div>
                      <p className="text-sm leading-6 text-slate-700">{review.comment}</p>
                      <p className="mt-3 text-xs font-semibold text-slate-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-gray-600">
                    No customer feedback yet
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProviderDashboard;
