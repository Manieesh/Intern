import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { bookingAPI, serviceAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Booking = () => {
  const { serviceId } = useParams();
  const { user, isAuthenticated } = useContext(AuthContext);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    scheduledDate: '',
    timeSlot: { start: '', end: '' },
    bookingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    notes: ''
  });

  useEffect(() => {
    fetchServiceDetails();
  }, [serviceId]);

  const fetchServiceDetails = async () => {
    try {
      const response = await serviceAPI.getServiceDetails(serviceId);
      setService(response.data.service);
    } catch (error) {
      toast.error('Failed to fetch service details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('timeSlot')) {
      const [_, field] = name.split('.');
      setBookingData({
        ...bookingData,
        timeSlot: {
          ...bookingData.timeSlot,
          [field]: value
        }
      });
    } else if (name.includes('address')) {
      const [_, field] = name.split('.');
      setBookingData({
        ...bookingData,
        bookingAddress: {
          ...bookingData.bookingAddress,
          [field]: value
        }
      });
    } else {
      setBookingData({
        ...bookingData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to book a service');
      return;
    }

    try {
      const payload = {
        ...bookingData,
        serviceId,
        providerId: service.providerId._id
      };

      await bookingAPI.createBooking(payload);
      toast.success('Booking created successfully!');
      setBookingData({
        scheduledDate: '',
        timeSlot: { start: '', end: '' },
        bookingAddress: {
          street: '',
          city: '',
          state: '',
          zipCode: ''
        },
        notes: ''
      });
    } catch (error) {
      toast.error('Failed to create booking');
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!service) return <div className="text-center py-12">Service not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Service Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">{service.name}</h2>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <div className="space-y-2 mb-6">
                <p><strong>Category:</strong> {service.category}</p>
                <p><strong>Price:</strong> ₹{service.basePrice}</p>
                <p><strong>Duration:</strong> {service.estimatedDuration?.value} {service.estimatedDuration?.unit}</p>
                <p><strong>Rating:</strong> {service.rating} ({service.totalReviews} reviews)</p>
              </div>
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Provider</h3>
                <p className="text-gray-600">{service.providerId.name}</p>
                <p className="text-sm text-gray-500">{service.providerId.businessName}</p>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-2xl font-bold mb-6">Book Service</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Date</label>
                  <input
                    type="date"
                    name="scheduledDate"
                    value={bookingData.scheduledDate}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                    <input
                      type="time"
                      name="timeSlot.start"
                      value={bookingData.timeSlot.start}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                    <input
                      type="time"
                      name="timeSlot.end"
                      value={bookingData.timeSlot.end}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                  <input
                    type="text"
                    name="address.street"
                    value={bookingData.bookingAddress.street}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Street address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      name="address.city"
                      value={bookingData.bookingAddress.city}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                    <input
                      type="text"
                      name="address.zipCode"
                      value={bookingData.bookingAddress.zipCode}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="ZIP"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Notes (Optional)</label>
                  <textarea
                    name="notes"
                    value={bookingData.notes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Any special requirements..."
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between mb-2">
                    <span>Service Price:</span>
                    <span>₹{service.basePrice}</span>
                  </div>
                  <div className="border-t pt-2 font-bold flex justify-between">
                    <span>Total Amount:</span>
                    <span>₹{service.basePrice}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 font-semibold"
                >
                  Proceed to Payment
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
