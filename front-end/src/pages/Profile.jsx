import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { User, Ticket, Calendar, MapPin, CheckCircle2, AlertCircle, RefreshCw, XCircle } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [confirmModalBooking, setConfirmModalBooking] = useState(null);
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState('');

  // Profile Edit State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || 'Mumbai');
  const [profileMsg, setProfileMsg] = useState('');

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      const res = await API.get('/bookings/my');
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to load user bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ name, phone, city });
      setProfileMsg('Profile details updated successfully!');
      setTimeout(() => setProfileMsg(''), 3000);
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  const handleConfirmCancel = async () => {
    if (!confirmModalBooking) return;
    const targetId = confirmModalBooking._id;

    try {
      setCancellingId(targetId);
      await API.put(`/bookings/${targetId}/cancel`);

      // Update local state smoothly
      setBookings((prev) =>
        prev.map((b) => (b._id === targetId ? { ...b, status: 'CANCELLED' } : b))
      );
      setCancelSuccessMsg(`Booking ${confirmModalBooking.bookingRef || targetId} cancelled successfully! Seats restored to showtime.`);
      setTimeout(() => setCancelSuccessMsg(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
      setConfirmModalBooking(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Confirmation Modal */}
      {confirmModalBooking && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-extrabold text-slate-900">Cancel Booking?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to cancel booking <strong className="text-slate-900 font-mono">{confirmModalBooking.bookingRef}</strong> for{' '}
              <strong>{confirmModalBooking.showtime?.event?.title || 'this event'}</strong>?
              The tickets will be returned to the showtime inventory.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmModalBooking(null)}
                className="px-4 py-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                Keep Booking
              </button>
              <button
                disabled={cancellingId === confirmModalBooking._id}
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors disabled:opacity-50"
              >
                {cancellingId === confirmModalBooking._id ? 'Cancelling...' : 'Yes, Cancel Ticket'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">My Profile & Bookings</h1>
        <p className="text-xs text-slate-500">Manage account information and view ticket history</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Edit Profile Box */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 space-y-4 shadow-xs">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-base uppercase">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">{user?.name}</h2>
              <span className="text-xs text-slate-500">{user?.email}</span>
              <span className="block text-[10px] font-bold text-red-600 uppercase mt-0.5">
                Role: {user?.role}
              </span>
            </div>
          </div>

          {profileMsg && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{profileMsg}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Default City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
            >
              Update Details
            </button>
          </form>
        </div>

        {/* Right Column: Booking History */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-red-600" /> Booking History ({bookings.length})
            </h2>
            <button
              onClick={fetchUserBookings}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>

          {cancelSuccessMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
              <span>{cancelSuccessMsg}</span>
            </div>
          )}

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((n) => (
                <div key={n} className="h-28 bg-white rounded-lg border border-slate-200 animate-pulse" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white p-8 rounded-lg border border-slate-200 text-center space-y-2">
              <Ticket className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No Tickets Booked Yet</h3>
              <p className="text-xs text-slate-500">Explore movies and live events to make your first booking.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => {
                const showtime = b.showtime;
                const event = showtime?.event;
                const isCancelled = b.status === 'CANCELLED';
                const seatNames = b.seatNames && b.seatNames.length > 0 ? b.seatNames.join(', ') : null;

                return (
                  <div
                    key={b._id}
                    className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-xs transition-shadow"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-red-600">
                          {b.bookingRef}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                            isCancelled ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900">{event?.title || 'Event'}</h3>
                      <p className="text-xs text-slate-600">📍 {event?.venue}, {event?.city}</p>
                      <p className="text-xs text-slate-500">
                        📅 {new Date(showtime?.dateTime).toLocaleString()} • {b.numTickets} Ticket(s)
                      </p>
                      {seatNames && (
                        <p className="text-xs font-semibold text-slate-700">
                          🪑 Seats: <span className="font-bold text-slate-900">{seatNames}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className="text-sm font-extrabold text-slate-900">₹{b.totalAmount}</span>

                      {!isCancelled && (
                        <button
                          onClick={() => setConfirmModalBooking(b)}
                          className="px-3 py-1.5 rounded bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-colors"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
