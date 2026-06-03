import React, { useState, useEffect, useContext } from 'react';
import { bookingAPI, serviceAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ProviderDashboard = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedBookings: 0,
    totalServices: 0,
    totalEarnings: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');

  useEffect(() => {
    fetchProviderData();
  }, []);

  const fetchProviderData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, servicesRes] = await Promise.all([
        bookingAPI.getProviderBookings(),
        serviceAPI.getProviderServices(user.id)
      ]);

      setBookings(bookingsRes.data.bookings);
      setServices(servicesRes.data.services);

      // Calculate stats
      const totalServices = servicesRes.data.services.length;
      const totalBookings = bookingsRes.data.bookings.length;
      const completedBookings = bookingsRes.data.bookings.filter(b => b.status === 'completed').length;
      const totalEarnings = bookingsRes.data.bookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + b.totalAmount, 0);

      setStats({
        totalBookings,
        completedBookings,
        totalServices,
        totalEarnings
      });
    } catch (error) {
      toast.error('Failed to fetch provider data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      await bookingAPI.updateBookingStatus(bookingId, { status });
      toast.success('Booking status updated');
      fetchProviderData();
    } catch (error) {
      toast.error('Failed to update booking status');
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Provider Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm">Total Services</p>
            <p className="text-3xl font-bold">{stats.totalServices}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm">Total Bookings</p>
            <p className="text-3xl font-bold">{stats.totalBookings}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm">Completed Bookings</p>
            <p className="text-3xl font-bold text-green-600">{stats.completedBookings}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm">Total Earnings</p>
            <p className="text-3xl font-bold">₹{stats.totalEarnings.toLocaleString()}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b flex">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'bookings'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600'
              }`}
            >
              Bookings ({stats.totalBookings})
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'services'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600'
              }`}
            >
              Services ({stats.totalServices})
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'bookings' && (
              <div className="space-y-4">
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <div key={booking._id} className="border rounded-lg p-4">
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
                          <p className="font-semibold">₹{booking.totalAmount}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          booking.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {booking.status}
                        </span>
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateStatus(booking._id, 'confirmed')}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Accept
                          </button>
                        )}
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(booking._id, 'in-progress')}
                            className="text-sm text-green-600 hover:text-green-800"
                          >
                            Start Service
                          </button>
                        )}
                        {booking.status === 'in-progress' && (
                          <button
                            onClick={() => handleUpdateStatus(booking._id, 'completed')}
                            className="text-sm text-green-600 hover:text-green-800"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No bookings yet</p>
                )}
              </div>
            )}

            {activeTab === 'services' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.length > 0 ? (
                  services.map((service) => (
                    <div key={service._id} className="border rounded-lg p-4">
                      <h4 className="font-semibold text-lg mb-2">{service.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{service.description.substring(0, 100)}...</p>
                      <div className="space-y-1 text-sm mb-3">
                        <p><strong>Category:</strong> {service.category}</p>
                        <p><strong>Price:</strong> ₹{service.basePrice}</p>
                        <p><strong>Rating:</strong> {service.rating} ({service.totalReviews} reviews)</p>
                        <p><strong>Bookings:</strong> {service.totalBookings}</p>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Edit Service
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No services yet. Create one to get started!</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
