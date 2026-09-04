import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Calendar, Users, DollarSign, Edit, Trash2, X, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const categoriesList = [
  { name: 'Movies', slug: 'movies' },
  { name: 'Concerts', slug: 'concerts' },
  { name: 'Comedy', slug: 'comedy' },
  { name: 'Sports', slug: 'sports' },
  { name: 'Kids', slug: 'kids' },
  { name: 'Workshops', slug: 'workshops' },
];

const OrganiserDashboard = () => {
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [showShowtimeModal, setShowShowtimeModal] = useState(false);
  const [selectedEventForShowtime, setSelectedEventForShowtime] = useState(null);

  // Event Form State
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    category: '',
    city: 'Mumbai',
    venue: '',
    bannerUrl: '',
    language: 'English',
    durationMinutes: 120,
  });

  // Showtime Form State
  const [showtimeForm, setShowtimeForm] = useState({
    dateTime: '',
    price: 300,
    totalSeats: 100,
  });

  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchOrganiserData();
  }, []);

  const fetchOrganiserData = async () => {
    try {
      setLoading(true);
      const [eventsRes, catsRes] = await Promise.all([
        API.get('/events/organiser/my'),
        API.get('/categories'),
      ]);

      setMyEvents(eventsRes.data);
      setCategories(catsRes.data);
      if (catsRes.data.length > 0) {
        setEventForm((prev) => ({ ...prev, category: catsRes.data[0]._id }));
      }
    } catch (err) {
      console.error('Failed to fetch organiser events:', err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateEventModal = () => {
    setEditingEvent(null);
    setEventForm({
      title: '',
      description: '',
      category: categories[0]?._id || '',
      city: 'Mumbai',
      venue: '',
      bannerUrl: '',
      language: 'English',
      durationMinutes: 120,
    });
    setFormError('');
    setShowEventModal(true);
  };

  const openEditEventModal = (event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      category: event.category?._id || event.category,
      city: event.city,
      venue: event.venue,
      bannerUrl: event.bannerUrl || '',
      language: event.language || 'English',
      durationMinutes: event.durationMinutes || 120,
    });
    setFormError('');
    setShowEventModal(true);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      if (editingEvent) {
        await API.put(`/events/${editingEvent._id}`, eventForm);
      } else {
        await API.post('/events', eventForm);
      }

      setShowEventModal(false);
      fetchOrganiserData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save event');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event and all associated showtimes?')) return;
    try {
      await API.delete(`/events/${eventId}`);
      fetchOrganiserData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete event');
    }
  };

  const openShowtimeModal = (event) => {
    setSelectedEventForShowtime(event);
    setShowtimeForm({
      dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      price: 300,
      totalSeats: 100,
    });
    setFormError('');
    setShowShowtimeModal(true);
  };

  const handleSaveShowtime = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      await API.post('/showtimes', {
        eventId: selectedEventForShowtime._id,
        dateTime: showtimeForm.dateTime,
        price: parseFloat(showtimeForm.price),
        totalSeats: parseInt(showtimeForm.totalSeats, 10),
      });

      setShowShowtimeModal(false);
      fetchOrganiserData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add showtime');
    } finally {
      setFormLoading(false);
    }
  };

  const isApproved = user?.role === 'ADMIN' || user?.organiserStatus === 'APPROVED';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Organiser Approval Banner */}
      {!isApproved && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Organiser Account Approval Pending</h4>
            <p className="mt-0.5">
              Your Organiser account status is currently <strong>PENDING</strong>. You may draft events, but publishing live events requires Admin approval.
            </p>
          </div>
        </div>
      )}

      {/* Header & Host CTA */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase text-blue-600 tracking-wider">Organiser Console</span>
          <h1 className="text-2xl font-extrabold text-slate-900">{user?.name}</h1>
          <p className="text-xs text-slate-500">Manage your event listings, venue showtimes, and ticket capacity</p>
        </div>

        <button
          onClick={openCreateEventModal}
          disabled={!isApproved}
          className="px-5 py-2.5 rounded bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" /> Create New Event
        </button>
      </div>

      {/* My Events List */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900">My Published & Draft Events ({myEvents.length})</h2>

        {loading ? (
          <div className="h-40 bg-white rounded-lg border border-slate-200 animate-pulse" />
        ) : myEvents.length === 0 ? (
          <div className="bg-white p-8 rounded-lg border border-slate-200 text-center space-y-2">
            <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No Events Created Yet</h3>
            <p className="text-xs text-slate-500">Click "Create New Event" to start listing your shows.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myEvents.map((event) => (
              <div key={event._id} className="bg-white p-5 rounded-lg border border-slate-200 space-y-4 shadow-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {event.category?.name}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{event.title}</h3>
                    <p className="text-xs text-slate-600">📍 {event.venue}, {event.city}</p>
                  </div>

                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                    event.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {event.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
                  <button
                    onClick={() => openShowtimeModal(event)}
                    className="flex-1 py-1.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-semibold flex items-center justify-center gap-1"
                  >
                    <Clock className="w-3.5 h-3.5" /> Add Showtime Slot
                  </button>
                  <button
                    onClick={() => openEditEventModal(event)}
                    className="py-1.5 px-3 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center justify-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event._id)}
                    className="py-1.5 px-3 rounded bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-semibold flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Create / Edit Event */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white max-w-lg w-full rounded-lg p-6 border border-slate-200 shadow-xl space-y-4 relative">
            <button onClick={() => setShowEventModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-extrabold text-slate-900">
              {editingEvent ? 'Edit Event Details' : 'Create New Event'}
            </h3>

            {formError && (
              <div className="p-2.5 bg-red-50 text-red-700 border border-red-200 rounded text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveEvent} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Title</label>
                <input
                  type="text"
                  required
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="e.g. Interstellar IMAX Special"
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Category</label>
                  <select
                    value={eventForm.category}
                    onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700">City</label>
                  <select
                    value={eventForm.city}
                    onChange={(e) => setEventForm({ ...eventForm, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 outline-none"
                  >
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Boston">Boston</option>
                    <option value="San Francisco">San Francisco</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Venue & Address</label>
                <input
                  type="text"
                  required
                  value={eventForm.venue}
                  onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                  placeholder="PVR IMAX, Lower Parel"
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Banner Image URL</label>
                <input
                  type="text"
                  value={eventForm.bannerUrl}
                  onChange={(e) => setEventForm({ ...eventForm, bannerUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Description</label>
                <textarea
                  rows="3"
                  required
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  placeholder="Full event description..."
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full py-2.5 rounded bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
              >
                {formLoading ? 'Saving...' : 'Save Event'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Showtime */}
      {showShowtimeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white max-w-sm w-full rounded-lg p-6 border border-slate-200 shadow-xl space-y-4 relative">
            <button onClick={() => setShowShowtimeModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold text-blue-600 uppercase">Add Showtime Slot</span>
              <h3 className="text-base font-extrabold text-slate-900 truncate">{selectedEventForShowtime?.title}</h3>
            </div>

            {formError && (
              <div className="p-2.5 bg-red-50 text-red-700 border border-red-200 rounded text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveShowtime} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Show Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={showtimeForm.dateTime}
                  onChange={(e) => setShowtimeForm({ ...showtimeForm, dateTime: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Ticket Price (₹)</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={showtimeForm.price}
                  onChange={(e) => setShowtimeForm({ ...showtimeForm, price: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Total Seat Capacity</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={showtimeForm.totalSeats}
                  onChange={(e) => setShowtimeForm({ ...showtimeForm, totalSeats: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full py-2.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                {formLoading ? 'Saving...' : 'Create Showtime'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganiserDashboard;
