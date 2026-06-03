import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiClock, FiMapPin, FiSearch, FiStar } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import { serviceAPI } from '../services/api';

const Services = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedCity, saveSelectedCity } = useContext(AuthContext);
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(params.get('category') || '');
  const [searchQuery, setSearchQuery] = useState(params.get('search') || '');
  const [city, setCity] = useState(params.get('city') || selectedCity || localStorage.getItem('selectedCity') || '');

  const categories = ['plumbing', 'electrical', 'carpentry', 'painting', 'cleaning', 'landscaping'];
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
    setLoading(true);
    try {
      const requestParams = { city };
      let response;

      if (category) {
        response = await serviceAPI.getServicesByCategory(category, requestParams);
      } else {
        response = await serviceAPI.searchServices(requestParams);
      }

      setServices(response.data.services || []);
    } catch (error) {
      toast.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  }, [category, city]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (city) {
      saveSelectedCity(city);
    }

    const nextParams = new URLSearchParams();
    if (city) nextParams.set('city', city);
    if (searchQuery) nextParams.set('search', searchQuery);
    navigate(`/services?${nextParams.toString()}`);

    try {
      const response = await serviceAPI.searchServices({ query: searchQuery, category, city });
      setServices(response.data.services || []);
    } catch (error) {
      toast.error('Search failed');
    }
  };

  const selectCategory = (cat) => {
    setCategory(cat);
    const nextParams = new URLSearchParams();
    if (city) nextParams.set('city', city);
    if (cat) nextParams.set('category', cat);
    navigate(`/services?${nextParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#f5fbfa]">
      <section className="bg-slate-950 py-12 text-white">
        <div className="container">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-teal-200">Location-based services</p>
          <h1 className="mt-3 text-4xl font-black sm:text-5xl">Find services in {city || 'your city'}</h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            ServiceHub shows providers based on your selected city so bookings stay relevant and nearby.
          </p>

          <form onSubmit={handleSearch} className="mt-8 grid gap-3 rounded-3xl border border-white/10 bg-white/10 p-3 backdrop-blur lg:grid-cols-[0.8fr_1fr_auto]">
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
            <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-slate-900">
              <FiSearch className="text-teal-700" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services..."
                className="w-full bg-transparent outline-none"
              />
            </div>
            <button type="submit" className="rounded-2xl bg-teal-400 px-7 py-3 font-black text-slate-950 transition hover:bg-teal-300">
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="container py-10">
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => selectCategory('')}
            className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
              category === '' ? 'bg-slate-950 text-white' : 'bg-white text-slate-700 shadow-sm hover:bg-teal-50'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => selectCategory(cat)}
              className={`rounded-full px-5 py-2.5 text-sm font-bold capitalize transition ${
                category === cat ? 'bg-slate-950 text-white' : 'bg-white text-slate-700 shadow-sm hover:bg-teal-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

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

        {loading ? (
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
                    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold capitalize text-teal-800">
                      {service.category}
                    </span>
                  </div>
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
                    <span className="text-2xl font-black text-teal-700">Rs {service.basePrice}</span>
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
