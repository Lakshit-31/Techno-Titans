import { Link } from "react-router-dom";

function EventCard({ event, onDelete }) {
  return (
    <div className="event-card">

      <img
        src={event.image}
        alt={event.title}
        className="event-image"
      />

      <div className="event-card-content">

        <span className="event-category">
          {event.category}
        </span>

        <h2>{event.title}</h2>

        <p className="event-description">
          {event.description}
        </p>

        <p>
          <strong>📅 Date:</strong>{" "}
          {new Date(event.date).toLocaleDateString()}
        </p>

        <p>
          <strong>⏰ Time:</strong> {event.time}
        </p>

        <p>
          <strong>📍 Venue:</strong> {event.venue}
        </p>

        <p>
          <strong>🎟️ Ticket:</strong> ₹{event.ticketPrice}
        </p>

        <p>
          <strong>💺 Available Seats:</strong>{" "}
          {event.availableSeats}
        </p>

        <div className="event-actions">

          <Link to={`/events/${event._id}`}>
            <button>
              View
            </button>
          </Link>

          <Link to={`/edit-event/${event._id}`}>
            <button className="edit-btn">
              Edit
            </button>
          </Link>

          <button
            className="delete-btn"
            onClick={() => onDelete(event._id)}
          >
            Delete
          </button>

        </div>

      </div>
    </div>
  );
}

export default EventCard;