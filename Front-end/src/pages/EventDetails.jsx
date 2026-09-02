import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function EventDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [error, setError] = useState("");
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/events/${id}`)
      .then(res => {
        setEvent(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Event not found");
        setLoading(false);
      });
  }, [id]);

  const handleBook = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    if (user.role === "event_manager") {
      setError("Event managers cannot book tickets.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/bookings", {
        eventId: id,
        numberOfTickets: quantity
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setBookingData(res.data);
      setBookingStatus("success");
      // Update available tickets locally
      setEvent(prev => ({...prev, availableTickets: prev.availableTickets - quantity}));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book tickets");
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error && !event) return <div className="text-center py-10 text-red-500">{error}</div>;

  const totalAmount = event.ticketPrice * quantity;

  if (bookingStatus === "success") {
    return (
      <div className="max-w-2xl mx-auto mt-10 bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Booking Confirmed!</h3>
          <div className="mt-2 text-sm text-gray-500 text-left bg-gray-50 p-4 rounded-md">
            <p><strong>Event:</strong> {event.title}</p>
            <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Tickets:</strong> {bookingData.numberOfTickets}</p>
            <p><strong>Total Amount:</strong> ₹{bookingData.totalAmount}</p>
            <p><strong>Booking ID:</strong> {bookingData._id}</p>
          </div>
          <div className="mt-5">
            <button onClick={() => navigate("/user/bookings")} className="inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-white bg-primary hover:bg-blue-600 sm:text-sm">
              View My Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg max-w-4xl mx-auto">
      {event.image && (
        <div className="h-64 w-full">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
        <div>
          <h3 className="text-2xl leading-6 font-bold text-gray-900">{event.title}</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">{event.category} • Organizer: {event.createdBy?.name || 'Unknown'}</p>
        </div>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          ₹{event.ticketPrice}
        </span>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Date & Time</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {new Date(event.date).toLocaleDateString()} • {event.startTime} - {event.endTime}
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Location</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{event.location}</dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Description</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{event.description}</dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Tickets Available</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {event.availableTickets === 0 ? <span className="text-red-600 font-bold">SOLD OUT</span> : event.availableTickets}
            </dd>
          </div>
        </dl>
      </div>

      <div className="bg-gray-50 px-4 py-5 sm:p-6 border-t border-gray-200">
        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}
        
        {event.availableTickets > 0 ? (
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <label htmlFor="quantity" className="text-sm font-medium text-gray-700">Quantity</label>
              <div className="flex items-center border rounded-md">
                <button 
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-l-md"
                >-</button>
                <input 
                  type="number" 
                  id="quantity" 
                  value={quantity} 
                  readOnly 
                  className="w-12 text-center border-0 p-1 focus:ring-0 sm:text-sm"
                />
                <button 
                  type="button"
                  onClick={() => setQuantity(Math.min(event.availableTickets, quantity + 1))}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-r-md"
                >+</button>
              </div>
              <div className="text-sm font-medium text-gray-900">Total: ₹{totalAmount}</div>
            </div>
            <button
              onClick={handleBook}
              disabled={event.availableTickets === 0}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              Book Tickets
            </button>
          </div>
        ) : (
          <button disabled className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gray-400 cursor-not-allowed">
            SOLD OUT
          </button>
        )}
      </div>
    </div>
  );
}
