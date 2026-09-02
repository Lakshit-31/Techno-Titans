import { useState, useEffect } from "react";
import axios from "axios";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/bookings/my-bookings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/bookings/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl mb-8">My Bookings</h2>
      
      {bookings.length === 0 ? (
        <p className="text-gray-500">You haven't made any bookings yet.</p>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white shadow overflow-hidden sm:rounded-lg flex flex-col sm:flex-row">
              {booking.eventId?.image && (
                <div className="w-full sm:w-48 h-48 sm:h-auto">
                  <img src={booking.eventId.image} alt={booking.eventId.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">{booking.eventId?.title || "Unknown Event"}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${booking.bookingStatus === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {booking.bookingStatus.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {booking.eventId?.date ? new Date(booking.eventId.date).toLocaleDateString() : ""} • {booking.eventId?.location || ""}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Tickets</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900">{booking.numberOfTickets}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Amount</p>
                      <p className="mt-1 text-lg font-semibold text-gray-900">₹{booking.totalAmount}</p>
                    </div>
                  </div>
                </div>
                {booking.bookingStatus === "confirmed" && booking.eventId?.date && new Date(booking.eventId.date) > new Date() && (
                  <div className="mt-6">
                    <button 
                      onClick={() => cancelBooking(booking._id)}
                      className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none"
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
