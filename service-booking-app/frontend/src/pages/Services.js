import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiClock, FiMapPin, FiSearch, FiStar } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import { serviceAPI } from '../services/api';

const serviceSearchAliases = {
  Electrician: 'Electrician',
  Plumber: 'Plumber',
  Carpenter: 'Carpenter',
  Painter: 'Painter',
  'AC Repair & Installation': 'AC Repair',
  'RO Water Purifier Service': 'Water Purifier',
  'CCTV Installation': 'CCTV Installation',
  'Appliance Repair (TV, Fridge, Washing Machine)': 'Appliance Repair',
  'Home Cleaning': 'Cleaning',
  'Pest Control': 'Pest Control',
  'Home Tutor': 'Home Tutor',
  'Online Tutor': 'Online Tutor',
  'Spoken English Trainer': 'Spoken English Trainer',
  'Computer Classes': 'Computer Classes',
  'Music Teacher': 'Music Teacher',
  'Dance Instructor': 'Dance Instructor',
  'Exam Coaching': 'Exam Coaching',
  Photographer: 'Photographer',
  Videographer: 'Videographer',
  DJ: 'DJ',
  Decorator: 'Decorator',
  Caterer: 'Caterer',
  'Makeup Artist': 'Makeup Artist',
  'Mehendi Artist': 'Mehendi Artist',
  'Event Planner': 'Event Planner',
  'Bike Mechanic': 'Bike Mechanic',
  'Car Mechanic': 'Car Mechanic',
  'Car Wash': 'Car Wash',
  'Towing Service': 'Towing Service',
  'Driving Instructor': 'Driving Instructor',
  'Vehicle Rental': 'Vehicle Rental',
  'Fitness Trainer': 'Fitness Trainer',
  'Yoga Instructor': 'Yoga Instructor',
  Physiotherapist: 'Physiotherapist',
  Dietician: 'Dietician',
  'Home Nurse': 'Home Nurse',
  'Elder Care Assistant': 'Elder Care Assistant',
  'Web Developer': 'Web Developer',
  'Graphic Designer': 'Graphic Designer',
  'Video Editor': 'Video Editor',
  'Social Media Manager': 'Social Media Manager',
  'Content Writer': 'Content Writer',
  'Digital Marketing Expert': 'Digital Marketing Expert',
  'Laundry Pickup': 'Laundry Pickup',
  'House Shifting Helper': 'House Shifting Helper',
  'Delivery Person': 'Delivery Person',
  'Gardening Service': 'Gardening Service',
  'Pet Care': 'Pet Care',
  'Security Guard': 'Security Guard',
  'Tractor Rental': 'Tractor Rental',
  'Farm Labor Booking': 'Farm Labor Booking',
  'Borewell Services': 'Borewell Services',
  'Irrigation Setup': 'Irrigation Setup',
  'Agricultural Consultant': 'Agricultural Consultant'
};

const serviceDomains = [
  {
    label: 'Home Services',
    categories: ['electrician', 'plumber', 'carpenter', 'painter', 'ac-repair-installation', 'ro-water-purifier-service', 'cctv-installation', 'appliance-repair', 'home-cleaning', 'pest-control', 'plumbing', 'electrical', 'carpentry', 'painting', 'cleaning', 'hvac'],
    services: [
      'Electrician',
      'Plumber',
      'Carpenter',
      'Painter',
      'AC Repair & Installation',
      'RO Water Purifier Service',
      'CCTV Installation',
      'Appliance Repair (TV, Fridge, Washing Machine)',
      'Home Cleaning',
      'Pest Control'
    ]
  },
  {
    label: 'Education Services',
    categories: ['home-tutor', 'online-tutor', 'spoken-english-trainer', 'computer-classes', 'music-teacher', 'dance-instructor', 'exam-coaching'],
    services: [
      'Home Tutor',
      'Online Tutor',
      'Spoken English Trainer',
      'Computer Classes',
      'Music Teacher',
      'Dance Instructor',
      'Exam Coaching'
    ]
  },
  {
    label: 'Event Services',
    categories: ['photographer', 'videographer', 'dj', 'decorator', 'caterer', 'makeup-artist', 'mehendi-artist', 'event-planner'],
    services: [
      'Photographer',
      'Videographer',
      'DJ',
      'Decorator',
      'Caterer',
      'Makeup Artist',
      'Mehendi Artist',
      'Event Planner'
    ]
  },
  {
    label: 'Vehicle Services',
    categories: ['bike-mechanic', 'car-mechanic', 'car-wash', 'towing-service', 'driving-instructor', 'vehicle-rental'],
    services: [
      'Bike Mechanic',
      'Car Mechanic',
      'Car Wash',
      'Towing Service',
      'Driving Instructor',
      'Vehicle Rental'
    ]
  },
  {
    label: 'Health & Wellness',
    categories: ['fitness-trainer', 'yoga-instructor', 'physiotherapist', 'dietician', 'home-nurse', 'elder-care-assistant'],
    services: [
      'Fitness Trainer',
      'Yoga Instructor',
      'Physiotherapist',
      'Dietician',
      'Home Nurse',
      'Elder Care Assistant'
    ]
  },
  {
    label: 'Digital Services',
    categories: ['web-developer', 'graphic-designer', 'video-editor', 'social-media-manager', 'content-writer', 'digital-marketing-expert'],
    services: [
      'Web Developer',
      'Graphic Designer',
      'Video Editor',
      'Social Media Manager',
      'Content Writer',
      'Digital Marketing Expert'
    ]
  },
  {
    label: 'Daily Life Services',
    categories: ['laundry-pickup', 'house-shifting-helper', 'delivery-person', 'gardening-service', 'pet-care', 'security-guard', 'cleaning', 'landscaping', 'locksmith'],
    services: [
      'Laundry Pickup',
      'House Shifting Helper',
      'Delivery Person',
      'Gardening Service',
      'Pet Care',
      'Security Guard'
    ]
  },
  {
    label: 'Agriculture Services',
    categories: ['tractor-rental', 'farm-labor-booking', 'borewell-services', 'irrigation-setup', 'agricultural-consultant', 'landscaping'],
    services: [
      'Tractor Rental',
      'Farm Labor Booking',
      'Borewell Services',
      'Irrigation Setup',
      'Agricultural Consultant'
    ]
  }
];

const allServiceOptions = serviceDomains.flatMap((domain) => domain.services);

const Services = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { saveSelectedCity } = useContext(AuthContext);
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [domain, setDomain] = useState(params.get('domain') || '');
  const [searchQuery, setSearchQuery] = useState(params.get('search') || '');
  const [city, setCity] = useState(params.get('city') || '');
  const [locationLoading, setLocationLoading] = useState(false);
  const activeDomain = serviceDomains.find((item) => item.label === domain);
  const activeServiceOptions = activeDomain ? activeDomain.services : allServiceOptions;

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

  useEffect(() => {
    const queryCity = params.get('city');
    if (queryCity) {
      setCity(queryCity);
      saveSelectedCity(queryCity);
    }
  }, [params, saveSelectedCity]);

  const fetchServices = useCallback(async () => {
    if (!city) {
      setServices([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const normalizedQuery = serviceSearchAliases[searchQuery] || searchQuery;
      const activeDomain = serviceDomains.find((item) => item.label === domain);
      const domainCategories = activeDomain?.categories || [];
      const response = await serviceAPI.searchServices({
        city,
        query: normalizedQuery,
        categories: domainCategories.join(',')
      });

      setServices(response.data.services || []);
    } catch (error) {
      toast.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  }, [city, domain, searchQuery]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city) {
      toast.error('Please select a city to find providers');
      setServices([]);
      return;
    }

    saveSelectedCity(city);

    const nextParams = new URLSearchParams();
    if (city) nextParams.set('city', city);
    if (domain) nextParams.set('domain', domain);
    if (searchQuery) nextParams.set('search', searchQuery);
    navigate(`/services?${nextParams.toString()}`);

    try {
      const response = await serviceAPI.searchServices({
        query: serviceSearchAliases[searchQuery] || searchQuery,
        categories: (serviceDomains.find((item) => item.label === domain)?.categories || []).join(','),
        city
      });
      setServices(response.data.services || []);
    } catch (error) {
      toast.error('Search failed');
    }
  };

  const fillCityFromCoordinates = async (latitude, longitude) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
    );
    const data = await response.json();
    const address = data.address || {};
    return address.city || address.town || address.village || address.district || '';
  };

  const handleUseLiveLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Live location is not supported by this browser');
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const detectedCity = await fillCityFromCoordinates(latitude, longitude);

          if (!detectedCity) {
            toast.error('Could not detect your city. Please choose it from the dropdown.');
            return;
          }

          setCity(detectedCity);
          saveSelectedCity(detectedCity);

          const nextParams = new URLSearchParams();
          nextParams.set('city', detectedCity);
          if (searchQuery) nextParams.set('search', searchQuery);
          if (domain) nextParams.set('domain', domain);
          navigate(`/services?${nextParams.toString()}`);
          toast.success(`Location detected: ${detectedCity}`);
        } catch (error) {
          toast.error('Could not detect your city. Please choose it from the dropdown.');
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        setLocationLoading(false);
        toast.error('Unable to access live location. Please allow location permission.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#f5fbfa]">
      <section className="bg-slate-950 py-12 text-white">
        <div className="container">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-teal-200">Location-based services</p>
          <h1 className="mt-3 text-4xl font-black sm:text-5xl">Find services in {city || 'your city'}</h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Select your city or use live location first. ServiceHub will show only workers available near you or in your city.
          </p>

          <div className="mt-8 grid gap-3 rounded-3xl border border-white/10 bg-white/10 p-3 backdrop-blur lg:grid-cols-[1fr_auto]">
            <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-slate-900">
              <FiMapPin className="text-teal-700" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-transparent outline-none"
              >
                <option value="">Select Tamil Nadu city</option>
                {tamilNaduCities.map((cityName) => (
                  <option key={cityName} value={cityName}>
                    {cityName}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={handleUseLiveLocation}
              disabled={locationLoading}
              className="rounded-2xl border border-white/20 bg-white/10 px-6 py-3 font-black text-white transition hover:bg-white/20 disabled:opacity-60"
            >
              {locationLoading ? 'Detecting...' : 'Use Live Location'}
            </button>
          </div>

          <form onSubmit={handleSearch} className={`mt-4 grid gap-3 rounded-3xl border p-3 backdrop-blur lg:grid-cols-[0.9fr_1.1fr_auto] ${
            city ? 'border-white/10 bg-white/10' : 'border-white/5 bg-white/5 opacity-60'
          }`}>
            <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-slate-900">
              <FiSearch className="text-teal-700" />
              <select
                value={domain}
                onChange={(e) => {
                  setDomain(e.target.value);
                  setSearchQuery('');
                }}
                disabled={!city}
                className="w-full bg-transparent outline-none"
              >
                <option value="">All</option>
                {serviceDomains.map((item) => (
                  <option key={item.label} value={item.label}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-slate-900">
              <FiSearch className="text-teal-700" />
              <select
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={!city}
                className="w-full bg-transparent outline-none"
              >
                <option value="">Select service</option>
                {activeServiceOptions.map((serviceName) => (
                  <option key={serviceName} value={serviceName}>
                    {serviceName}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={!city}
              className="rounded-2xl bg-teal-400 px-7 py-3 font-black text-slate-950 transition hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Search
            </button>
          </form>
          {!city && <p className="mt-3 text-sm font-semibold text-teal-100">Service search will unlock after location is selected.</p>}
        </div>
      </section>

      <section className="container py-10">
        {!city && (
          <div className="mb-8 rounded-3xl border border-teal-100 bg-white px-6 py-10 text-center shadow-sm">
            <FiMapPin className="mx-auto text-4xl text-teal-700" />
            <h2 className="mt-4 text-3xl font-black text-slate-950">Choose your location first</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Select your Tamil Nadu city or use live location above. After that, you can choose services and see workers available near you.
            </p>
          </div>
        )}

        <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-black text-slate-950">Available Services</h2>
            <p className="mt-1 text-slate-600">
              {city ? `Showing providers available in ${city}.` : 'Enter a city to see local providers.'}
            </p>
          </div>
          <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-teal-800 shadow-sm">
            {services.length} result{services.length === 1 ? '' : 's'}
          </span>
        </div>

        {!city ? null : loading ? (
          <div className="rounded-3xl bg-white py-16 text-center shadow-sm">
            <p className="font-semibold text-slate-600">Loading city-based services...</p>
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div key={service._id} className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-teal-50 transition hover:-translate-y-1 hover:shadow-2xl">
                {service.images && service.images[0] ? (
                  <img src={service.images[0]} alt={service.name} className="h-48 w-full object-cover" />
                ) : (
                  <div className="flex h-48 items-center justify-center bg-gradient-to-br from-teal-100 to-slate-100 text-5xl font-black text-teal-800">
                    {service.name?.charAt(0)}
                  </div>
                )}
                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="text-xl font-black text-slate-950">{service.name}</h3>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                      service.providerId?.isOnline ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {service.providerId?.isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  <span className="mb-3 inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-bold capitalize text-teal-800">
                    {service.category}
                  </span>
                  <p className="text-sm leading-6 text-slate-600">{service.description?.substring(0, 110)}...</p>

                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <FiStar className="text-amber-500" />
                      <span>{service.rating || 0} ({service.totalReviews || 0} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock />
                      <span>{service.estimatedDuration?.value || 1} {service.estimatedDuration?.unit || 'hours'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiMapPin />
                      <span>{service.providerId?.address?.city || city || 'Local provider'}</span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-2xl font-black text-teal-700">Rs {service.basePrice}/hr</span>
                    <Link to={`/booking/${service._id}`} className="rounded-full bg-slate-950 px-5 py-2.5 font-bold text-white transition hover:bg-teal-800">
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-sm">
            <h3 className="text-2xl font-black text-slate-950">No services found in {city || 'this city'}</h3>
            <p className="mx-auto mt-3 max-w-xl text-slate-600">
              Try another city or clear the category filter. Providers need a city in their profile to appear here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Services;
