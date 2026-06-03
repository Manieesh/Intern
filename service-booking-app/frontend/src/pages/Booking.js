import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { bookingAPI, serviceAPI } from '../services/api';

const initialBookingData = {
  scheduledDate: '',
  timeSlot: { start: '', end: '' },
  bookingAddress: {
    street: '',
    city: '',
    state: '',
    zipCode: ''
  },
  paymentMethod: 'postpaid',
  notes: ''
};

const timeOptions = [
  '06:00 AM',
  '06:30 AM',
  '07:00 AM',
  '07:30 AM',
  '08:00 AM',
  '08:30 AM',
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '01:00 PM',
  '01:30 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
  '05:00 PM',
  '05:30 PM',
  '06:00 PM',
  '06:30 PM',
  '07:00 PM',
  '07:30 PM',
  '08:00 PM',
  '08:30 PM',
  '09:00 PM'
];

const parseTimeToMinutes = (time) => {
  const match = /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i.exec(time || '');
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();

  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

const calculateBookedHours = (timeSlot) => {
  const start = parseTimeToMinutes(timeSlot.start);
  const end = parseTimeToMinutes(timeSlot.end);

  if (start === null || end === null || end <= start) return 0;
  return (end - start) / 60;
};

const getTodayDateValue = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getCurrentMinutes = () => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

const isToday = (dateValue) => dateValue === getTodayDateValue();

const validateFutureSchedule = (bookingData) => {
  if (!bookingData.scheduledDate) return 'Please select a booking date';
  if (bookingData.scheduledDate < getTodayDateValue()) return 'Cannot book a service for a past date';

  const start = parseTimeToMinutes(bookingData.timeSlot.start);
  if (start === null) return 'Please select a start time';
  if (isToday(bookingData.scheduledDate) && start <= getCurrentMinutes()) {
    return 'Cannot book a service for a past time';
  }

  if (!calculateBookedHours(bookingData.timeSlot)) return 'Please select a valid start and end time';
  return null;
};

const Booking = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const [bookingData, setBookingData] = useState(initialBookingData);
  const [prePaymentActive, setPrePaymentActive] = useState(false);
  const [prePaymentSeconds, setPrePaymentSeconds] = useState(120);
  const [prePaymentAmount, setPrePaymentAmount] = useState(0);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const prePaymentBookingRef = useRef(null);
  const bookingInProgressRef = useRef(false);
  const bookedHours = calculateBookedHours(bookingData.timeSlot);
  const calculatedAmount = service ? Math.round(service.basePrice * bookedHours) : 0;
  const todayDateValue = getTodayDateValue();
  const availableStartTimes = timeOptions.filter((time) => (
    !isToday(bookingData.scheduledDate) || parseTimeToMinutes(time) > getCurrentMinutes()
  ));
  const availableEndTimes = timeOptions.filter((time) => {
    const start = parseTimeToMinutes(bookingData.timeSlot.start);
    const end = parseTimeToMinutes(time);
    return start === null || end > start;
  });

  const createBooking = useCallback(async (paymentMethod, bookingSnapshot = bookingData) => {
    if (bookingInProgressRef.current) return;

    if (!isAuthenticated) {
      toast.error('Please login to book a service');
      return;
    }

    if (!service) {
      toast.error('Service details are not ready');
      return;
    }

    bookingInProgressRef.current = true;
    setBookingSubmitting(true);

    try {
      await bookingAPI.createBooking({
        ...bookingSnapshot,
        paymentMethod,
        serviceId,
        providerId: service.providerId?._id || service.providerId
      });

      toast.success(
        paymentMethod === 'postpaid'
          ? 'Post payment booking placed successfully!'
          : 'Pre payment completed. Booking placed successfully!'
      );
      setBookingData(initialBookingData);
      setPrePaymentActive(false);
      setPrePaymentSeconds(120);
      setPrePaymentAmount(0);
      prePaymentBookingRef.current = null;
      navigate('/bookings');
    } catch (error) {
      setPrePaymentActive(false);
      setPrePaymentSeconds(120);
      setPrePaymentAmount(0);
      prePaymentBookingRef.current = null;
      toast.error(error.response?.data?.message || error.response?.data?.error || 'Failed to create booking');
    } finally {
      bookingInProgressRef.current = false;
      setBookingSubmitting(false);
    }
  }, [bookingData, isAuthenticated, navigate, service, serviceId]);

  useEffect(() => {
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

    fetchServiceDetails();
  }, [serviceId]);

  useEffect(() => {
    if (!prePaymentActive) return undefined;

    if (prePaymentSeconds === 0) {
      if (!prePaymentBookingRef.current) {
        setPrePaymentActive(false);
        setPrePaymentSeconds(120);
        setPrePaymentAmount(0);
        toast.error('Payment booking details were lost. Please try again.');
        return undefined;
      }

      createBooking('prepaid', prePaymentBookingRef.current);
      return undefined;
    }

    const timer = setTimeout(() => {
      setPrePaymentSeconds((seconds) => seconds - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [createBooking, prePaymentActive, prePaymentSeconds]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'scheduledDate') {
      setBookingData({
        ...bookingData,
        scheduledDate: value,
        timeSlot: { start: '', end: '' }
      });
      return;
    }

    if (name.includes('timeSlot')) {
      const [, field] = name.split('.');
      setBookingData({
        ...bookingData,
        timeSlot: {
          ...bookingData.timeSlot,
          [field]: value,
          ...(field === 'start' ? { end: '' } : {})
        }
      });
      return;
    }

    if (name.includes('address')) {
      const [, field] = name.split('.');
      setBookingData({
        ...bookingData,
        bookingAddress: {
          ...bookingData.bookingAddress,
          [field]: value
        }
      });
      return;
    }

    setBookingData({
      ...bookingData,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const scheduleError = validateFutureSchedule(bookingData);
    if (scheduleError) {
      toast.error(scheduleError);
      return;
    }

    if (bookingData.paymentMethod === 'prepaid') {
      prePaymentBookingRef.current = {
        ...bookingData,
        bookingAddress: {
          ...bookingData.bookingAddress,
          coordinates: bookingData.bookingAddress.coordinates
        },
        timeSlot: {
          ...bookingData.timeSlot
        }
      };
      setPrePaymentActive(true);
      setPrePaymentSeconds(120);
      setPrePaymentAmount(calculatedAmount);
      toast.info('Scan the QR and wait for confirmation. Booking will be placed after 2 minutes.');
      return;
    }

    createBooking('postpaid');
  };

  const handlePaymentDone = () => {
    createBooking('prepaid', prePaymentBookingRef.current || bookingData);
  };

  const formatCountdown = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = String(seconds % 60).padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
  };

  const fillAddressFromCoordinates = async (latitude, longitude) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
    );
    const data = await response.json();
    const address = data.address || {};
    const streetParts = [
      address.house_number,
      address.road || address.neighbourhood || address.suburb
    ].filter(Boolean);

    return {
      street: streetParts.join(', ') || data.display_name || '',
      city: address.city || address.town || address.village || address.district || '',
      state: address.state || '',
      zipCode: address.postcode || ''
    };
  };

  const handleUseLiveLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Live location is not supported by this browser');
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const address = await fillAddressFromCoordinates(latitude, longitude);
          setBookingData((current) => ({
            ...current,
            bookingAddress: {
              ...current.bookingAddress,
              ...address,
              coordinates: {
                latitude,
                longitude
              }
            }
          }));
          toast.success('Live location and address added');
        } catch (error) {
          setBookingData((current) => ({
            ...current,
            bookingAddress: {
              ...current.bookingAddress,
              coordinates: {
                latitude,
                longitude
              }
            }
          }));
          toast.info('Location added. Address lookup failed, please fill address manually.');
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

  if (loading) return <div className="py-12 text-center">Loading...</div>;
  if (!service) return <div className="py-12 text-center">Service not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-2xl font-bold">{service.name}</h2>
              <p className="mb-4 text-gray-600">{service.description}</p>
              <div className="mb-6 space-y-2">
                <p><strong>Category:</strong> {service.category}</p>
                <p><strong>Hourly Rate:</strong> Rs {service.basePrice}/hour</p>
                <p><strong>Duration:</strong> {service.estimatedDuration?.value} {service.estimatedDuration?.unit}</p>
                <p><strong>Rating:</strong> {service.rating} ({service.totalReviews} reviews)</p>
              </div>
              <div className="border-t pt-4">
                <h3 className="mb-2 font-semibold">Provider</h3>
                <p className="text-gray-600">{service.providerId.name}</p>
                <p className="text-sm text-gray-500">{service.providerId.businessName}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="mb-6 text-2xl font-bold">Book Service</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Scheduled Date</label>
                  <input
                    type="date"
                    name="scheduledDate"
                    value={bookingData.scheduledDate}
                    onChange={handleChange}
                    min={todayDateValue}
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Start Time</label>
                    <select
                      name="timeSlot.start"
                      value={bookingData.timeSlot.start}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    >
                      <option value="">Select start time</option>
                      {availableStartTimes.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">End Time</label>
                    <select
                      name="timeSlot.end"
                      value={bookingData.timeSlot.end}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    >
                      <option value="">Select end time</option>
                      {availableEndTimes.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Street Address</label>
                  <input
                    type="text"
                    name="address.street"
                    value={bookingData.bookingAddress.street}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="Street address"
                  />
                </div>

                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-bold text-gray-900">Live Location</p>
                      <p className="mt-1 text-sm text-gray-600">
                        Add your current location and auto-fill street, city, and zip code when available.
                      </p>
                      {bookingData.bookingAddress.coordinates && (
                        <p className="mt-2 text-xs font-semibold text-blue-700">
                          Location added: {bookingData.bookingAddress.coordinates.latitude.toFixed(5)},{' '}
                          {bookingData.bookingAddress.coordinates.longitude.toFixed(5)}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleUseLiveLocation}
                      disabled={locationLoading}
                      className="rounded-full bg-blue-600 px-5 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                      {locationLoading ? 'Getting location...' : 'Use Live Location'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      name="address.city"
                      value={bookingData.bookingAddress.city}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Zip Code</label>
                    <input
                      type="text"
                      name="address.zipCode"
                      value={bookingData.bookingAddress.zipCode}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="ZIP"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Special Notes (Optional)</label>
                  <textarea
                    name="notes"
                    value={bookingData.notes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="Any special requirements..."
                  />
                </div>

                <div className="rounded-md bg-gray-50 p-4">
                  <div className="mb-2 flex justify-between">
                    <span>Hourly Rate:</span>
                    <span>Rs {service.basePrice}/hour</span>
                  </div>
                  <div className="mb-2 flex justify-between">
                    <span>Selected Duration:</span>
                    <span>{bookedHours ? `${bookedHours} hour${bookedHours === 1 ? '' : 's'}` : 'Select time'}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-bold">
                    <span>Total Amount:</span>
                    <span>Rs {calculatedAmount}</span>
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-gray-700">Payment Method</label>
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className={`cursor-pointer rounded-xl border p-4 transition ${
                      bookingData.paymentMethod === 'prepaid'
                        ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100'
                        : 'border-gray-200 bg-white hover:border-blue-200'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="prepaid"
                        checked={bookingData.paymentMethod === 'prepaid'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <p className="font-bold text-gray-900">Pre Payment</p>
                      <p className="mt-1 text-sm text-gray-600">Demo mode: booking is placed and payment stays pending.</p>
                    </label>
                    <label className={`cursor-pointer rounded-xl border p-4 transition ${
                      bookingData.paymentMethod === 'postpaid'
                        ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100'
                        : 'border-gray-200 bg-white hover:border-blue-200'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="postpaid"
                        checked={bookingData.paymentMethod === 'postpaid'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <p className="font-bold text-gray-900">Post Payment</p>
                      <p className="mt-1 text-sm text-gray-600">Pay after the provider completes the service.</p>
                    </label>
                  </div>
                </div>

                {prePaymentActive && (
                  <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-center">
                    <p className="text-sm font-bold uppercase tracking-wide text-blue-700">Scan to pay</p>
                    <h4 className="mt-2 text-2xl font-black text-gray-950">Amount: Rs {prePaymentAmount}</h4>
                    <img
                      src="/assets/prepayment-qr.png"
                      alt="Pre payment QR code"
                      className="mx-auto mt-4 h-64 w-64 rounded-xl bg-white object-contain p-3 shadow"
                    />
                    <p className="mt-4 text-sm font-semibold text-gray-700">
                      Booking will be placed automatically in {formatCountdown(prePaymentSeconds)}.
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      This is a project demo flow. Keep this page open until the timer finishes.
                    </p>
                    <button
                      type="button"
                      onClick={handlePaymentDone}
                      disabled={bookingSubmitting}
                      className="mt-4 rounded-full bg-green-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-60"
                    >
                      {bookingSubmitting ? 'Booking service...' : 'Payment Done'}
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={prePaymentActive || bookingSubmitting}
                  className="w-full rounded-md bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {bookingSubmitting
                    ? 'Booking service...'
                    : prePaymentActive
                    ? `Payment window active (${formatCountdown(prePaymentSeconds)})`
                    : bookingData.paymentMethod === 'postpaid'
                      ? 'Book Service'
                      : 'Show QR and Book After 2 Minutes'}
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
