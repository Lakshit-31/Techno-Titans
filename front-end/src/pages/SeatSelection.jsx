import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import API from '../services/api';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Ticket, Calendar, Clock, MapPin, AlertCircle, Check } from 'lucide-react';

const SeatSelection = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const showtimeId = searchParams.get('showtimeId');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setSelectedEvent, setSelectedShowtime, selectedSeats, setSelectedSeats } = useBooking();

  const [eventData, setEventData] = useState(null);
  const [showtimeData, setShowtimeData] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSeatData();
  }, [id, showtimeId]);

  const fetchSeatData = async () => {
    try {
      setLoading(true);
      setError('');

      const [eventRes, seatsRes, showtimeRes] = await Promise.all([
        API.get(`/events/${id}`),
        API.get(`/seats/showtime/${showtimeId}`),
        API.get(`/showtimes/event/${id}`),
      ]);

      setEventData(eventRes.data);
      setSelectedEvent(eventRes.data);

      const matchedShowtime = showtimeRes.data.find((st) => st._id === showtimeId) || showtimeRes.data[0];
      setShowtimeData(matchedShowtime);
      setSelectedShowtime(matchedShowtime);

      setSeats(seatsRes.data.seats || []);
    } catch (err) {
      console.error('Failed to fetch seat map:', err);
      setError(err.response?.data?.message || 'Failed to load cinema seat map');
    } finally {
      setLoading(false);
    }
  };

  // Group seats by Row (A to O)
  const rowsList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];

  const toggleSeatSelection = (seat) => {
    if (seat.status === 'SOLD') return;

    const isAlreadySelected = selectedSeats.some((s) => s._id === seat._id);
    if (isAlreadySelected) {
      setSelectedSeats(selectedSeats.filter((s) => s._id !== seat._id));
    } else {
      // Limit selection to 10 seats max per booking
      if (selectedSeats.length >= 10) {
        alert('You can select a maximum of 10 seats per booking.');
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleProceedToCheckout = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat to proceed.');
      return;
    }

    if (!user) {
      navigate('/login', { state: { from: { pathname: `/events/${id}/seats`, search: `?showtimeId=${showtimeId}` } } });
      return;
    }

    navigate(`/checkout?eventId=${id}&showtimeId=${showtimeId}`);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-600 border-t-transparent" />
      </div>
    );
  }

  if (error || !eventData || !showtimeData) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white text-center rounded-lg border border-slate-200 space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Seat Map Unavailable</h2>
        <p className="text-xs text-slate-500">{error || 'Could not load showtime details.'}</p>
        <Link to={`/events/${id}`} className="inline-block px-4 py-2 bg-red-600 text-white font-bold text-xs rounded">
          Back to Event Details
        </Link>
      </div>
    );
  }

  const totalPrice = selectedSeats.length * showtimeData.price;
  const selectedSeatLabels = selectedSeats.map((s) => `${s.row}${s.number}`).join(', ');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-28">
      {/* Header & Event Metadata */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
        <div>
          <Link to={`/events/${id}`} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-red-600 mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Movie Info
          </Link>
          <h1 className="text-xl font-extrabold text-slate-900">{eventData.title}</h1>
          <p className="text-xs text-slate-600 flex items-center gap-2 mt-1">
            <span>📍 {eventData.venue}, {eventData.city}</span>
            <span>•</span>
            <span className="font-semibold text-slate-800">📅 {new Date(showtimeData.dateTime).toLocaleString()}</span>
          </p>
        </div>

        <div className="bg-slate-50 px-4 py-2 rounded border border-slate-200 text-right">
          <span className="text-[11px] text-slate-500 block">Ticket Price</span>
          <span className="text-base font-extrabold text-slate-900">₹{showtimeData.price}</span>
        </div>
      </div>

      {/* Seat Map Panel */}
      <div className="bg-white p-6 sm:p-8 rounded-lg border border-slate-200 shadow-xs space-y-8 overflow-x-auto">
        {/* CINEMA SCREEN Banner */}
        <div className="max-w-xl mx-auto space-y-2">
          <div className="w-full h-2 bg-gradient-to-b from-slate-300 to-slate-200 rounded-t-lg" />
          <div className="bg-slate-100 text-slate-600 py-1.5 text-center text-[11px] font-bold tracking-widest uppercase border border-slate-200 rounded shadow-2xs">
            🎬 CINEMA SCREEN THIS WAY
          </div>
        </div>

        {/* 5-State Legend Bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-700 bg-slate-50 p-3 rounded border border-slate-200 max-w-2xl mx-auto">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded border border-slate-300 bg-white" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded bg-slate-200 border border-slate-300 text-slate-400 flex items-center justify-center text-[10px]">✕</div>
            <span>Sold</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded bg-red-600 border border-red-600 text-white flex items-center justify-center text-[10px]">✓</div>
            <span>Your Seat</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded bg-blue-50 border border-blue-400 text-blue-700 flex items-center justify-center text-[10px]">♿</div>
            <span>Wheelchair</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded bg-amber-50 border border-amber-400 text-amber-700 flex items-center justify-center text-[10px]">👥</div>
            <span>Companion</span>
          </div>
        </div>

        {/* Seat Grid Layout (Rows A to O) */}
        <div className="space-y-2.5 min-w-[620px] max-w-3xl mx-auto pt-2">
          {rowsList.map((rowLabel) => {
            const rowSeats = seats.filter((s) => s.row === rowLabel);
            const leftBlock = rowSeats.filter((s) => s.section === 'left');
            const rightBlock = rowSeats.filter((s) => s.section === 'right');

            return (
              <div key={rowLabel} className="flex items-center justify-center gap-3">
                {/* Row Label Left */}
                <span className="w-6 text-center text-xs font-bold text-slate-400 uppercase shrink-0">
                  {rowLabel}
                </span>

                {/* Left Block */}
                <div className="flex gap-1.5">
                  {leftBlock.map((seat) => {
                    const isSelected = selectedSeats.some((s) => s._id === seat._id);
                    const isSold = seat.status === 'SOLD';

                    let styleClass = 'bg-white border-slate-300 text-slate-700 hover:border-red-500 hover:bg-red-50/50';
                    if (isSold) {
                      styleClass = 'bg-slate-200 border-slate-200 text-slate-400 cursor-not-allowed opacity-60';
                    } else if (isSelected) {
                      styleClass = 'bg-red-600 border-red-600 text-white font-bold shadow-xs';
                    } else if (seat.seatType === 'WHEELCHAIR') {
                      styleClass = 'bg-blue-50 border-blue-400 text-blue-700 hover:bg-blue-100';
                    } else if (seat.seatType === 'COMPANION') {
                      styleClass = 'bg-amber-50 border-amber-400 text-amber-700 hover:bg-amber-100';
                    }

                    return (
                      <button
                        key={seat._id}
                        disabled={isSold}
                        onClick={() => toggleSeatSelection(seat)}
                        title={`Row ${seat.row}, Seat ${seat.number} (${seat.seatType})`}
                        className={`w-7 h-7 rounded text-[11px] font-semibold border flex items-center justify-center transition-all ${styleClass}`}
                      >
                        {isSelected ? (
                          '✓'
                        ) : isSold ? (
                          '✕'
                        ) : seat.seatType === 'WHEELCHAIR' ? (
                          '♿'
                        ) : seat.seatType === 'COMPANION' ? (
                          '👥'
                        ) : (
                          seat.number
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Center Aisle */}
                <div className="w-8 sm:w-12 text-center text-[10px] text-slate-300 font-bold uppercase tracking-wider shrink-0">
                  AISLE
                </div>

                {/* Right Block */}
                <div className="flex gap-1.5">
                  {rightBlock.map((seat) => {
                    const isSelected = selectedSeats.some((s) => s._id === seat._id);
                    const isSold = seat.status === 'SOLD';

                    let styleClass = 'bg-white border-slate-300 text-slate-700 hover:border-red-500 hover:bg-red-50/50';
                    if (isSold) {
                      styleClass = 'bg-slate-200 border-slate-200 text-slate-400 cursor-not-allowed opacity-60';
                    } else if (isSelected) {
                      styleClass = 'bg-red-600 border-red-600 text-white font-bold shadow-xs';
                    } else if (seat.seatType === 'WHEELCHAIR') {
                      styleClass = 'bg-blue-50 border-blue-400 text-blue-700 hover:bg-blue-100';
                    } else if (seat.seatType === 'COMPANION') {
                      styleClass = 'bg-amber-50 border-amber-400 text-amber-700 hover:bg-amber-100';
                    }

                    return (
                      <button
                        key={seat._id}
                        disabled={isSold}
                        onClick={() => toggleSeatSelection(seat)}
                        title={`Row ${seat.row}, Seat ${seat.number} (${seat.seatType})`}
                        className={`w-7 h-7 rounded text-[11px] font-semibold border flex items-center justify-center transition-all ${styleClass}`}
                      >
                        {isSelected ? (
                          '✓'
                        ) : isSold ? (
                          '✕'
                        ) : seat.seatType === 'WHEELCHAIR' ? (
                          '♿'
                        ) : seat.seatType === 'COMPANION' ? (
                          '👥'
                        ) : (
                          seat.number
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Row Label Right */}
                <span className="w-6 text-center text-xs font-bold text-slate-400 uppercase shrink-0">
                  {rowLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Sticky Bottom Selection Summary Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-lg z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-500">
              Selected Seats ({selectedSeats.length}):{' '}
              <strong className="text-slate-900">{selectedSeatLabels || 'None'}</strong>
            </div>
            <div className="text-lg font-extrabold text-slate-900">
              Total: <span className="text-red-600">₹{totalPrice}</span>
            </div>
          </div>

          <button
            onClick={handleProceedToCheckout}
            disabled={selectedSeats.length === 0}
            className="px-6 py-2.5 rounded bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-2"
          >
            <Ticket className="w-4 h-4" /> Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
