import React, { useState, useEffect } from 'react';
import { serviceAPI } from '../services/api';
import { FiStar, FiMapPin, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['plumbing', 'electrical', 'carpentry', 'painting', 'cleaning', 'landscaping'];

  useEffect(() => {
    fetchServices();
  }, [category]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      let response;
      if (category) {
        response = await serviceAPI.getServicesByCategory(category);
      } else {
        response = await serviceAPI.searchServices({});
      }
      setServices(response.data.services || []);
    } catch (error) {
      toast.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await serviceAPI.searchServices({ query: searchQuery });
      setServices(response.data.services || []);
    } catch (error) {
      toast.error('Search failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Section */}
      <div className="bg-blue-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Find Services</h1>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services..."
              className="flex-1 px-4 py-2 rounded text-gray-800"
            />
            <button type="submit" className="bg-blue-700 px-6 py-2 rounded hover:bg-blue-800">
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <button
            onClick={() => setCategory('')}
            className={`p-3 rounded text-center font-medium transition ${
              category === ''
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-800 border border-gray-300 hover:border-blue-600'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`p-3 rounded text-center font-medium transition capitalize ${
                category === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800 border border-gray-300 hover:border-blue-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <h2 className="text-2xl font-bold mb-6">Available Services</h2>
        {loading ? (
          <div className="text-center py-12">
            <p>Loading services...</p>
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
              >
                {service.images && service.images[0] && (
                  <img
                    src={service.images[0]}
                    alt={service.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{service.description.substring(0, 100)}...</p>

                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FiStar className="text-yellow-500" />
                      <span>{service.rating || 0} ({service.totalReviews || 0} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock />
                      <span>{service.estimatedDuration?.value} {service.estimatedDuration?.unit}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">₹{service.basePrice}</span>
                    <Link
                      to={`/booking/${service._id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No services found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
