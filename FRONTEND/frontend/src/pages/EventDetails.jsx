import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getEventById, deleteEvent } from "../services/eventService";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await getEventById(id);

        console.log("Event details:", response);

        setEvent(response.data);
      } catch (error) {
        console.error("Error fetching event:", error);
        setError("Event not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteEvent(id);

      alert("Event deleted successfully!");

      navigate("/events");
    } catch (error) {
      console.error("Delete error:", error);

      alert("Failed to delete event.");
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <p>Loading event...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <h2>{error}</h2>

        <Link to="/events">
          <button>Back to Events</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">

      <Link to="/events">
        <button className="back-btn">
          ← Back to Events
        </button>
      </Link>

      <div className="event-details">

        <img
          src={event.image}
          alt={event.title}
          className="event-details-image"
        />

        <div className="event-details-content">

          <span className="event-category">
            {event.category}
          </span>

          <h1>{event.title}</h1>

          <p className="event-details-description">
            {event.description}
          </p>

          <div className="event-info">

            <div>
              <strong>📅 Date</strong>
              <p>
                {new Date(event.date).toLocaleDateString()}
              </p>
            </div>

            <div>
              <strong>⏰ Time</strong>
              <p>{event.time}</p>
            </div>

            <div>
              <strong>📍 Venue</strong>
              <p>{event.venue}</p>
            </div>

            <div>
              <strong>🎟️ Ticket Price</strong>
              <p>₹{event.ticketPrice}</p>
            </div>

            <div>
              <strong>💺 Available Seats</strong>
              <p>{event.availableSeats}</p>
            </div>

          </div>

          <div className="event-actions">

            <Link to={`/edit-event/${event._id}`}>
              <button className="edit-btn">
                Edit Event
              </button>
            </Link>

            <button
              className="delete-btn"
              onClick={handleDelete}
            >
              Delete Event
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default EventDetails;