import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getEventById,
  updateEvent,
} from "../services/eventService";

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    date: "",
    time: "",
    venue: "",
    ticketPrice: "",
    availableSeats: "",
    category: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await getEventById(id);

        const event = response.data;

        setFormData({
          title: event.title || "",
          description: event.description || "",
          image: event.image || "",
          date: event.date
            ? event.date.substring(0, 10)
            : "",
          time: event.time || "",
          venue: event.venue || "",
          ticketPrice: event.ticketPrice || "",
          availableSeats: event.availableSeats || "",
          category: event.category || "",
        });
      } catch (error) {
        console.error("Fetch event error:", error);

        alert("Failed to load event.");

        navigate("/events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      const data = {
        ...formData,
        ticketPrice: Number(formData.ticketPrice),
        availableSeats: Number(formData.availableSeats),
      };

      await updateEvent(id, data);

      alert("Event updated successfully!");

      navigate(`/events/${id}`);
    } catch (error) {
      console.error("Update event error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update event."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <p>Loading event...</p>
      </div>
    );
  }

  return (
    <div className="page-container">

      <div className="form-container">

        <h1>Edit Event</h1>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Event Title</label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label>Event Image URL</label>

            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">

            <div className="form-group">
              <label>Date</label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Time</label>

              <input
                type="text"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <div className="form-group">
            <label>Venue</label>

            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">

            <div className="form-group">
              <label>Ticket Price</label>

              <input
                type="number"
                name="ticketPrice"
                value={formData.ticketPrice}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Available Seats</label>

              <input
                type="number"
                name="availableSeats"
                value={formData.availableSeats}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

          </div>

          <div className="form-group">
            <label>Category</label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">
                Select Category
              </option>

              <option value="Technology">
                Technology
              </option>

              <option value="Sports">
                Sports
              </option>

              <option value="Cultural">
                Cultural
              </option>

              <option value="Music">
                Music
              </option>

              <option value="Workshop">
                Workshop
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>

          <div className="form-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={() =>
                navigate(`/events/${id}`)
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
            >
              {saving ? "Updating..." : "Update Event"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditEvent;