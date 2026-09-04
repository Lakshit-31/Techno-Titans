import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import API from '../services/api';
import { useBooking } from '../context/BookingContext';
import { QRCodeSVG } from 'qrcode.react';
import { Ticket, Calendar, MapPin, Clock, AlertCircle, ShieldCheck, ArrowLeft, QrCode, CreditCard, Smartphone, Lock } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const {
    selectedEvent: ctxEvent,
    selectedShowtime: ctxShowtime,
    ticketQuantity,
    setTicketQuantity,
    selectedSeats,
    clearBookingDraft,
  } = useBooking();

  const [event, setEvent] = useState(ctxEvent || location.state?.event || null);
  const [showtime, setShowtime] = useState(ctxShowtime || location.state?.showtime || null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(!event || !showtime);
  const [error, setError] = useState('');

  // Payment Method Tabs: 'UPI' | 'CREDIT_CARD' | 'DEBIT_CARD'
  const [activePaymentTab, setActivePaymentTab] = useState('UPI');

  // Form Fields State
  const [upiId, setUpiId] = useState('rohan@upi');

  // Card Form State
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (!event || !showtime) {
      const eventId = searchParams.get('eventId');
      const showtimeId = searchParams.get('showtimeId');

      if (eventId && showtimeId) {
        fetchCheckoutData(eventId, showtimeId);
      } else {
        setPageLoading(false);
      }
    } else {
      setPageLoading(false);
    }
  }, []);

  const fetchCheckoutData = async (eventId, showtimeId) => {
    try {
      setPageLoading(true);
      const [eventRes, showtimeRes] = await Promise.all([
        API.get(`/events/${eventId}`),
        API.get(`/showtimes/event/${eventId}`),
      ]);

      setEvent(eventRes.data);
      const matchedShowtime = showtimeRes.data.find((st) => st._id === showtimeId) || showtimeRes.data[0];
      setShowtime(matchedShowtime);
    } catch (err) {
      console.error('Failed to fetch checkout details:', err);
    } finally {
      setPageLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-600 border-t-transparent" />
      </div>
    );
  }

  if (!event || !showtime) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white text-center rounded-lg border border-slate-200 space-y-4">
        <h2 className="text-lg font-bold text-slate-800">No Booking Draft Selected</h2>
        <p className="text-xs text-slate-500">Please select an event and showtime first.</p>
        <button
          onClick={() => navigate('/events')}
          className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded"
        >
          Browse Events
        </button>
      </div>
    );
  }

  const isSeatSelectionMode = selectedSeats && selectedSeats.length > 0;
  const count = isSeatSelectionMode ? selectedSeats.length : ticketQuantity;
  const totalAmount = showtime.price * count;
  const seatNamesLabel = isSeatSelectionMode ? selectedSeats.map((s) => `${s.row}${s.number}`).join(', ') : null;

  // Dummy bookingRef for UPI QR payload
  const dummyPayloadRef = `BKG-${Date.now().toString().slice(-6)}`;
  const upiQrPayload = `upi://pay?pa=eventhub@dummy&am=${totalAmount}&tn=${dummyPayloadRef}`;

  // Card Format Handlers
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleCardExpiryChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    const formatted = raw.replace(/^(\d{2})(\d)/, '$1/$2');
    setCardExpiry(formatted);
  };

  const handleCardCvvChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCardCvv(raw);
  };

  // Client-side Validation & Submission
  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setValidationError('');
    setError('');

    let maskedPaymentDetail = '';

    if (activePaymentTab === 'UPI') {
      if (!upiId.trim() || !upiId.includes('@')) {
        setValidationError('Please enter a valid UPI ID (e.g. name@upi or 9876543210@paytm)');
        return;
      }
      maskedPaymentDetail = upiId.trim();
    } else {
      // Credit or Debit Card Validation
      if (!cardName.trim()) {
        setValidationError('Please enter the cardholder name');
        return;
      }

      const digitsOnlyNum = cardNumber.replace(/\s/g, '');
      if (digitsOnlyNum.length !== 16) {
        setValidationError('Please enter a valid 16-digit card number');
        return;
      }

      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) {
        setValidationError('Please enter a valid expiry date in MM/YY format');
        return;
      }

      // Check future expiry date
      const [expMonthStr, expYearStr] = cardExpiry.split('/');
      const expMonth = parseInt(expMonthStr, 10);
      const expYear = 2000 + parseInt(expYearStr, 10);
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        setValidationError('The card expiry date cannot be in the past');
        return;
      }

      if (cardCvv.length !== 3) {
        setValidationError('Please enter a valid 3-digit CVV');
        return;
      }

      // Mask card number: **** **** **** 4242
      const lastFour = digitsOnlyNum.slice(-4);
      maskedPaymentDetail = `**** **** **** ${lastFour}`;
    }

    try {
      setLoading(true);

      const payload = {
        showtimeId: showtime._id,
        paymentMethod: activePaymentTab,
        maskedPaymentDetail,
      };

      if (isSeatSelectionMode) {
        payload.seatIds = selectedSeats.map((s) => s._id);
      } else {
        payload.numTickets = ticketQuantity;
      }

      const res = await API.post('/bookings', payload);

      const confirmedBooking = res.data;
      clearBookingDraft();

      navigate('/confirmation', { state: { booking: confirmedBooking } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Checkout & Payment</h1>
        <p className="text-xs text-slate-500">Review your ticket summary and select simulated payment method</p>
      </div>

      {(error || validationError) && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{validationError ? 'Form Validation Error' : 'Booking Exception'}</span>
          </div>
          <p>{validationError || error}</p>
          {error && isSeatSelectionMode && (
            <Link
              to={`/events/${event._id}/seats?showtimeId=${showtime._id}`}
              className="inline-block px-3 py-1 bg-red-600 text-white font-bold text-[11px] rounded"
            >
              Re-select Available Seats →
            </Link>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Order Summary (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-slate-200 p-6 space-y-6 shadow-xs h-fit">
          <div className="border-b border-slate-100 pb-4 space-y-1">
            <span className="text-[10px] font-bold uppercase text-red-600 tracking-wider">
              {event.category?.name || 'Event'}
            </span>
            <h2 className="text-base font-extrabold text-slate-900 leading-snug">{event.title}</h2>
            <p className="text-xs text-slate-600">📍 {event.venue}, {event.city}</p>
            <p className="text-xs text-slate-500">📅 {new Date(showtime.dateTime).toLocaleString()}</p>
          </div>

          {/* Seat / Quantity Summary Box */}
          {isSeatSelectionMode ? (
            <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <Ticket className="w-4 h-4 text-red-600" /> Assigned Seats ({count})
                </span>
                <Link
                  to={`/events/${event._id}/seats?showtimeId=${showtime._id}`}
                  className="text-red-600 text-[11px] font-semibold flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" /> Change
                </Link>
              </div>
              <p className="text-xs font-bold text-slate-900 bg-white p-2 rounded border border-slate-200">
                🪑 {seatNamesLabel}
              </p>
            </div>
          ) : (
            <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <Ticket className="w-4 h-4 text-red-600" /> Ticket Quantity
                </span>
                <span className="text-slate-500">{showtime.seatsAvailable} available</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    disabled={ticketQuantity <= 1}
                    onClick={() => setTicketQuantity((q) => Math.max(1, q - 1))}
                    className="w-7 h-7 rounded bg-white border border-slate-300 hover:bg-slate-100 font-bold text-slate-800 text-xs disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="text-sm font-extrabold text-slate-900 w-5 text-center">
                    {ticketQuantity}
                  </span>
                  <button
                    disabled={ticketQuantity >= showtime.seatsAvailable || ticketQuantity >= 10}
                    onClick={() => setTicketQuantity((q) => q + 1)}
                    className="w-7 h-7 rounded bg-white border border-slate-300 hover:bg-slate-100 font-bold text-slate-800 text-xs disabled:opacity-40"
                  >
                    +
                  </button>
                </div>

                <span className="font-bold text-slate-800 text-xs">₹{showtime.price} / ticket</span>
              </div>
            </div>
          )}

          {/* Pricing Breakdown */}
          <div className="space-y-2 text-xs border-t border-slate-100 pt-4">
            <div className="flex justify-between text-slate-600">
              <span>Tickets ({count}x)</span>
              <span>₹{showtime.price * count}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Convenience Fee</span>
              <span className="text-emerald-600 font-semibold">FREE (₹0)</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-slate-900 border-t border-slate-100 pt-3">
              <span>Total Amount</span>
              <span className="text-red-600">₹{totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Payment Method Tabs & Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200 p-6 space-y-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-red-600" /> Select Payment Method
          </h2>

          {/* Flat Payment Method Tabs */}
          <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-md border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setActivePaymentTab('UPI');
                setValidationError('');
              }}
              className={`py-2 px-3 rounded text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activePaymentTab === 'UPI'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Smartphone className="w-4 h-4" /> UPI
            </button>
            <button
              type="button"
              onClick={() => {
                setActivePaymentTab('CREDIT_CARD');
                setValidationError('');
              }}
              className={`py-2 px-3 rounded text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activePaymentTab === 'CREDIT_CARD'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <CreditCard className="w-4 h-4" /> Credit Card
            </button>
            <button
              type="button"
              onClick={() => {
                setActivePaymentTab('DEBIT_CARD');
                setValidationError('');
              }}
              className={`py-2 px-3 rounded text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activePaymentTab === 'DEBIT_CARD'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <CreditCard className="w-4 h-4" /> Debit Card
            </button>
          </div>

          <form onSubmit={handleConfirmBooking} className="space-y-6">
            {/* TAB 1: UPI PAYMENT */}
            {activePaymentTab === 'UPI' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center space-y-3">
                  <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                    Scan QR Code to Pay
                  </span>
                  <div className="bg-white p-3 inline-block rounded-md border border-slate-200 shadow-2xs">
                    <QRCodeSVG
                      value={upiQrPayload}
                      size={140}
                      bgColor="#FFFFFF"
                      fgColor="#0F172A"
                      level="M"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Encodes payload: <code className="bg-slate-200 px-1 rounded text-[10px] font-mono">upi://pay?pa=eventhub@dummy&am={totalAmount}</code>
                  </p>
                </div>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-200" />
                  <span className="shrink-0 mx-3 text-slate-400 text-[11px] font-semibold uppercase">Or Pay via UPI ID</span>
                  <div className="flex-grow border-t border-slate-200" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Virtual Payment Address (VPA / UPI ID)</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. username@upi or 9876543210@paytm"
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-red-500 rounded py-2 px-3 text-xs outline-none"
                  />
                  <span className="text-[11px] text-slate-400">Cosmetic simulated UPI address</span>
                </div>
              </div>
            )}

            {/* TAB 2 & 3: CREDIT / DEBIT CARD FORM */}
            {(activePaymentTab === 'CREDIT_CARD' || activePaymentTab === 'DEBIT_CARD') && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Full Name as printed on card"
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-red-500 rounded py-2 px-3 text-xs outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Card Number (16 Digits)</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="4111 2222 3333 4242"
                    maxLength="19"
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-red-500 rounded py-2 px-3 text-xs font-mono outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">Expiry Date (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={handleCardExpiryChange}
                      placeholder="12/28"
                      maxLength="5"
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-red-500 rounded py-2 px-3 text-xs font-mono outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">CVV (3 Digits)</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={handleCardCvvChange}
                      placeholder="•••"
                      maxLength="3"
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-red-500 rounded py-2 px-3 text-xs font-mono outline-none"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-[11px] text-slate-500 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Full card number and CVV are never stored in database. Masked format <strong className="text-slate-700">**** **** **** {cardNumber.replace(/\s/g, '').slice(-4) || '4242'}</strong> will be saved.</span>
                </div>
              </div>
            )}

            {/* Action Button */}
            <button
              type="submit"
              disabled={loading || showtime.seatsAvailable <= 0 || count < 1}
              className="w-full py-3 rounded bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" /> Simulate Payment & Confirm Booking (₹{totalAmount})
                </>
              )}
            </button>

            <p className="text-[11px] text-slate-400 text-center">
              🔒 100% Simulated payment workflow for demonstration
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
