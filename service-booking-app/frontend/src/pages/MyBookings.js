import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FiCalendar, FiClock, FiDollarSign, FiMail, FiMapPin, FiPhone, FiStar, FiUser } from 'react-icons/fi';
import { bookingAPI, reviewAPI } from '../services/api';

const statuses = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [feedbackForms, setFeedbackForms] = useState({});
  const [reviewedBookings, setReviewedBookings] = useState({});

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const response = await bookingAPI.getMyBookings(params);
      setBookings(response.data.bookings || []);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancelBooking = async (booking) => {
    const cancellationCharge = Math.round((booking.totalAmount * 20) / 100);
    if (!window.confirm(`Cancel this booking? A cancellation charge of Rs ${cancellationCharge} will be paid to the provider.`)) return;

    try {
      await bookingAPI.cancelBooking(booking._id, { reason: 'Cancelled by customer' });
      toast.success(`Booking cancelled. Rs ${cancellationCharge} charged and credited to provider.`);
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data?.error || 'Failed to cancel booking');
    }
  };

  const getProviderAddress = (provider) => {
    const address = provider?.address;
    if (!address) return 'Address not provided';
    return [address.street, address.city, address.state, address.zipCode, address.country].filter(Boolean).join(', ') || 'Address not provided';
  };

  const updateFeedbackForm = (bookingId, field, value) => {
    setFeedbackForms((current) => ({
      ...current,
      [bookingId]: {
        rating: 5,
        comment: '',
        ...(current[bookingId] || {}),
        [field]: value
      }
    }));
  };

  const handleFeedbackSubmit = async (booking) => {
    const form = feedbackForms[booking._id] || {};

    if (!form.comment?.trim()) {
      toast.error('Please add your feedback');
      return;
    }

    try {
      await reviewAPI.createReview({
        bookingId: booking._id,
        rating: Number(form.rating || 5),
        comment: form.comment
      });
      toast.success('Feedback submitted');
      setReviewedBookings((current) => ({ ...current, [booking._id]: true }));
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Failed to submit feedback';
      toast.error(message);
      if (message.toLowerCase().includes('already exists')) {
        setReviewedBookings((current) => ({ ...current, [booking._id]: true }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="mb-8 text-3xl font-bold">My Bookings</h1>

        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter('')}
            className={`rounded px-4 py-2 font-medium ${
              statusFilter === '' ? 'bg-blue-600 text-white' : 'border border-gray-300 bg-white hover:border-blue-600'
            }`}
          >
            All
          </button>
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded px-4 py-2 font-medium capitalize ${
                statusFilter === status ? 'bg-blue-600 text-white' : 'border border-gray-300 bg-white hover:border-blue-600'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-12 text-center">Loading bookings...</div>
        ) : bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="rounded-lg bg-white p-6 shadow">
                <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-500">Booking ID</p>
                    <p className="font-semibold">{booking.bookingNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Service</p>
                    <p className="font-semibold">{booking.serviceId?.name}</p>
                  </div>
                </div>

                <div className="mb-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiCalendar size={16} />
                    <span>{new Date(booking.scheduledDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiClock size={16} />
                    <span>{booking.timeSlot?.start} - {booking.timeSlot?.end}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiMapPin size={16} />
                    <span>{booking.bookingAddress?.city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiDollarSign size={16} />
                    <span>Rs {booking.totalAmount}</span>
                  </div>
                  {booking.status === 'cancelled' && (
                    <div className="flex items-center gap-2 text-red-600">
                      <FiDollarSign size={16} />
                      <span>Cancellation charge: Rs {booking.cancellationCharge || 0}</span>
                    </div>
                  )}
                </div>

                <div className="mb-4 rounded-2xl border border-teal-100 bg-teal-50 p-4">
                  <p className="mb-3 text-sm font-black uppercase tracking-wide text-teal-800">Provider Contact Details</p>
                  <div className="grid gap-3 text-sm md:grid-cols-2">
                    <div className="flex items-center gap-2 text-slate-700">
                      <FiUser className="text-teal-700" />
                      <span>{booking.providerId?.name || 'Name not provided'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <FiPhone className="text-teal-700" />
                      <span>{booking.providerId?.phone || 'Phone not provided'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <FiMail className="text-teal-700" />
                      <span>{booking.providerId?.email || 'Email not provided'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <FiMapPin className="text-teal-700" />
                      <span>{getProviderAddress(booking.providerId)}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    booking.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : booking.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : booking.status === 'confirmed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    booking.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.paymentStatus}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {booking.paymentDetails?.method === 'prepaid' ? 'Pre Payment' : 'Post Payment'}
                  </span>
                </div>

                {['confirmed'].includes(booking.status) && (
                  <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm font-black uppercase tracking-wide text-amber-800">Service Start OTP</p>
                    <p className="mt-2 text-3xl font-black tracking-[0.25em] text-slate-950">{booking.serviceOtp}</p>
                    <p className="mt-2 text-sm text-amber-800">
                      Share this OTP with the provider only when they arrive and are ready to start the work.
                    </p>
                  </div>
                )}

                {!['completed', 'cancelled'].includes(booking.status) && (
                  <button
                    onClick={() => handleCancelBooking(booking)}
                    className="text-sm font-medium text-red-600 hover:text-red-800"
                  >
                    Cancel Booking (20% charge)
                  </button>
                )}

                {booking.status === 'completed' && (
                  <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    {booking.hasReview || reviewedBookings[booking._id] ? (
                      <p className="font-semibold text-emerald-700">Feedback submitted. Thank you.</p>
                    ) : (
                      <>
                        <div className="mb-4 flex items-center gap-2">
                          <FiStar className="text-amber-500" />
                          <div>
                            <p className="font-black text-slate-900">How was your service?</p>
                            <p className="text-sm text-slate-500">Share feedback after the work is completed.</p>
                          </div>
                        </div>
                        <div className="grid gap-3 md:grid-cols-[160px_1fr]">
                          <select
                            value={feedbackForms[booking._id]?.rating || 5}
                            onChange={(event) => updateFeedbackForm(booking._id, 'rating', event.target.value)}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-teal-500"
                          >
                            {[5, 4, 3, 2, 1].map((rating) => (
                              <option key={rating} value={rating}>
                                {rating} Star{rating > 1 ? 's' : ''}
                              </option>
                            ))}
                          </select>
                          <p className="flex items-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-500">
                            Rate the completed service
                          </p>
                        </div>
                        <textarea
                          value={feedbackForms[booking._id]?.comment || ''}
                          onChange={(event) => updateFeedbackForm(booking._id, 'comment', event.target.value)}
                          className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500"
                          rows="3"
                          placeholder="Write your feedback about the provider"
                        />
                        <button
                          onClick={() => handleFeedbackSubmit(booking)}
                          className="mt-3 rounded-full bg-teal-600 px-5 py-2 text-sm font-bold text-white hover:bg-teal-700"
                        >
                          Submit Feedback
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg bg-white py-12 text-center">
            <p className="text-gray-600">No bookings found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
