import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { MapPin, Calendar, Clock, Ticket, Users, ArrowLeft, CheckCircle2, Star, MessageSquare } from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setSelectedEvent, setSelectedShowtime } = useBooking();

  const [eventData, setEventData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeShowtime, setActiveShowtime] = useState(null);

  // New Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchEventDetails();
    fetchEventReviews();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/events/${id}`);
      setEventData(res.data);
      if (res.data.showtimes && res.data.showtimes.length > 0) {
        setActiveShowtime(res.data.showtimes[0]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load event details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchEventReviews = async () => {
    try {
      const res = await API.get(`/reviews/event/${id}`);
      setReviews(res.data);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    }
  };

  const handleProceedToCheckout = () => {
    if (!activeShowtime) {
      alert('Please select a showtime slot to proceed.');
      return;
    }
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/events/${id}` } } });
      return;
    }

    setSelectedEvent(eventData);
    setSelectedShowtime(activeShowtime);

    const isMovie = eventData.category?.slug === 'movies' || activeShowtime.hasSeatMap;
    if (isMovie) {
      navigate(`/events/${id}/seats?showtimeId=${activeShowtime._id}`);
    } else {
      navigate(`/checkout?eventId=${id}&showtimeId=${activeShowtime._id}`, {
        state: { event: eventData, showtime: activeShowtime },
      });
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setSubmittingReview(true);
      await API.post('/reviews', {
        eventId: id,
        rating,
        comment,
      });
      setComment('');
      fetchEventReviews();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-600 border-t-transparent" />
      </div>
    );
  }

  if (error || !eventData) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white text-center rounded-lg border border-slate-200 space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Event Not Found</h2>
        <p className="text-xs text-slate-500">{error || 'This event may have been unpublished or removed.'}</p>
        <Link to="/events" className="inline-block px-4 py-2 bg-red-600 text-white font-bold text-xs rounded">
          Back to Events Catalog
        </Link>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <Link to="/events" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-red-600">
        <ArrowLeft className="w-4 h-4" /> Back to Listing
      </Link>

      {/* Hero Banner Section */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-1 h-72 lg:h-auto bg-slate-100 relative">
          <img
            src={eventData.bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800'}
            alt={eventData.title}
            className="w-full h-full object-cover"
          />
          <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-extrabold uppercase">
            {eventData.category?.name || 'Event'}
          </span>
        </div>

        <div className="lg:col-span-2 p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {eventData.language} • {eventData.durationMinutes} mins
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {eventData.title}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <MapPin className="w-4 h-4 text-red-600 shrink-0" />
              <span>{eventData.venue}, {eventData.city}</span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold uppercase text-slate-700 mb-1">About The Event</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{eventData.description}</p>
          </div>

          <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs flex justify-between items-center">
            <div>
              <span className="text-slate-500 block text-[11px]">Organiser</span>
              <span className="font-bold text-slate-800">{eventData.organiser?.name}</span>
            </div>
            <span className="text-[11px] text-slate-500">{eventData.organiser?.city}</span>
          </div>
        </div>
      </div>

      {/* Showtimes Selector Section */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 space-y-4 shadow-xs">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-red-600" /> Select Showtime & Date
          </h3>
          <p className="text-xs text-slate-500">Pick an available showtime slot to proceed with booking</p>
        </div>

        {eventData.showtimes && eventData.showtimes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {eventData.showtimes.map((st) => {
              const isSelected = activeShowtime?._id === st._id;
              const isSoldOut = st.seatsAvailable <= 0;
              return (
                <button
                  key={st._id}
                  disabled={isSoldOut}
                  onClick={() => setActiveShowtime(st)}
                  className={`p-3.5 rounded-md border text-left flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'bg-red-50 border-red-500 text-red-700 shadow-xs'
                      : isSoldOut
                      ? 'bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold">{formatDate(st.dateTime)}</span>
                    <span className="text-xs font-extrabold text-slate-900">₹{st.price}</span>
                  </div>

                  <div className="mt-2 flex justify-between items-center text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Clock className="w-3 h-3 text-red-600" /> {formatTime(st.dateTime)}
                    </span>
                    <span>
                      {isSoldOut ? (
                        <strong className="text-red-600">SOLD OUT</strong>
                      ) : (
                        `${st.seatsAvailable} seats left`
                      )}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded text-center text-xs text-slate-500">
            No active showtimes currently listed for this event. Check back later!
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleProceedToCheckout}
            disabled={!activeShowtime || activeShowtime.seatsAvailable <= 0}
            className="px-6 py-2.5 rounded bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-colors"
          >
            Proceed to Select Tickets
          </button>
        </div>
      </div>

      {/* Ratings & Reviews Section */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 space-y-6 shadow-xs">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-red-600" /> Ratings & Reviews ({reviews.length})
        </h3>

        {/* Add Review Form */}
        <form onSubmit={handleReviewSubmit} className="bg-slate-50 p-4 rounded border border-slate-200 space-y-3">
          <span className="text-xs font-bold text-slate-800 block">Leave a Review</span>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-600">Rating:</span>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="bg-white border border-slate-200 rounded px-2 py-1 outline-none font-bold"
            >
              <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
              <option value="4">⭐⭐⭐⭐ (4/5)</option>
              <option value="3">⭐⭐⭐ (3/5)</option>
              <option value="2">⭐⭐ (2/5)</option>
              <option value="1">⭐ (1/5)</option>
            </select>
          </div>

          <textarea
            rows="2"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            className="w-full bg-white border border-slate-200 rounded p-2 text-xs outline-none"
          />

          <button
            type="submit"
            disabled={submittingReview}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded"
          >
            Submit Review
          </button>
        </form>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No reviews submitted yet for this event.</p>
        ) : (
          <div className="space-y-3 divide-y divide-slate-100">
            {reviews.map((r) => (
              <div key={r._id} className="pt-3 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-800">{r.user?.name}</span>
                  <span className="text-xs text-amber-500 font-bold">★ {r.rating}/5</span>
                </div>
                <p className="text-xs text-slate-600">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
