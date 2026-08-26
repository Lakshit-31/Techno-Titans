import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EventCard from "../components/EventCard";
import { getEvents, deleteEvent } from "../services/eventService";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getEvents();

      console.log("Events API Response:", response);

      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteEvent(id);

      setEvents((previousEvents) =>
        previousEvents.filter((event) => event._id !== id)
      );

      alert("Event deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete event.");
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <h1>All Events</h1>
        <p>Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <h1>All Events</h1>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="page-container">

      <div className="events-header">
        <div>
          <h1>All Events</h1>
          <p>Discover and manage upcoming events</p>
        </div>

        <Link to="/create-event">
          <button className="create-btn">
            + Create Event
          </button>
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="empty-events">
          <h2>No Events Found</h2>

          <p>
            There are currently no events available.
          </p>

          <Link to="/create-event">
            <button>Create Event</button>
          </Link>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

    </div>
  );
}

export default Events;