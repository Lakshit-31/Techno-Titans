import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Ticket, Calendar, MapPin, CreditCard, Smartphone } from 'lucide-react';

const Confirmation = () => {
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white text-center rounded-lg border border-slate-200 space-y-4">
        <h2 className="text-lg font-bold text-slate-800">No Booking Data Found</h2>
        <Link to="/" className="inline-block px-4 py-2 bg-red-600 text-white font-bold text-xs rounded">
          Return to Home
        </Link>
      </div>
    );
  }

  const showtime = booking.showtime;
  const event = showtime?.event;
  const seatNames = booking.seatNames && booking.seatNames.length > 0 ? booking.seatNames.join(', ') : null;

  const formatPaymentLabel = () => {
    if (booking.paymentMethod === 'UPI') {
      return `UPI (${booking.maskedPaymentDetail || 'eventhub@dummy'})`;
    } else if (booking.paymentMethod === 'CREDIT_CARD') {
      return `Credit Card (${booking.maskedPaymentDetail || '**** 4242'})`;
    } else if (booking.paymentMethod === 'DEBIT_CARD') {
      return `Debit Card (${booking.maskedPaymentDetail || '**** 4242'})`;
    }
    return 'Simulated Payment';
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-10 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Booking Confirmed!</h1>
        <p className="text-xs text-slate-500">Your e-ticket has been issued successfully.</p>
      </div>

      {/* Ticket Pass Container */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        {/* Pass Header */}
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-mono text-red-400 font-bold uppercase block tracking-wider">
              E-TICKET REFERENCE
            </span>
            <span className="text-base font-mono font-bold">{booking.bookingRef}</span>
          </div>

          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase">
            {booking.status}
          </span>
        </div>

        {/* Ticket Details Body */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">{event?.title}</h3>
            <p className="text-xs text-slate-600">📍 {event?.venue}, {event?.city}</p>
            <p className="text-xs text-slate-500">
              📅 {new Date(showtime?.dateTime).toLocaleString()}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 text-[11px] block">Tickets Count</span>
              <span className="font-bold text-slate-800">{booking.numTickets} Ticket(s)</span>
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block">Total Paid</span>
              <span className="font-bold text-red-600">₹{booking.totalAmount}</span>
            </div>
            {seatNames && (
              <div className="col-span-2 border-t border-slate-200 pt-2">
                <span className="text-slate-500 text-[11px] block">Assigned Seats</span>
                <span className="font-extrabold text-slate-900 font-mono text-xs">🪑 {seatNames}</span>
              </div>
            )}
            <div className="col-span-2 border-t border-slate-200 pt-2 flex justify-between items-center">
              <span className="text-slate-500 text-[11px]">Payment Method:</span>
              <span className="font-semibold text-slate-800 text-[11px]">{formatPaymentLabel()}</span>
            </div>
          </div>

          {/* QR Code Pass Box */}
          <div className="border border-dashed border-slate-300 rounded p-4 text-center space-y-2 bg-slate-50">
            <div className="w-28 h-28 mx-auto bg-slate-900 rounded flex items-center justify-center text-white text-[9px] font-mono p-2 text-center break-all">
              [QR: {booking.bookingRef}]
            </div>
            <span className="text-[10px] text-slate-500 font-semibold block">PRESENT THIS CODE AT VENUE ENTRANCE</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between gap-3 text-xs">
          <Link to="/profile" className="flex-1 text-center py-2 bg-slate-900 text-white font-bold rounded">
            View in My Bookings
          </Link>
          <Link to="/" className="flex-1 text-center py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded">
            Book More Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
