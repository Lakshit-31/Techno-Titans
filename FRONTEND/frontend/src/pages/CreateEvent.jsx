import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../services/eventService";

function CreateEvent() {
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

  const [loading, setLoading] = useState(false);

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
      setLoading(true);

      const data = {
        ...formData,
        ticketPrice: Number(formData.ticketPrice),
        availableSeats: Number(formData.availableSeats),
      };

      await createEvent(data);

      alert("Event created successfully!");

      navigate("/events");
    } catch (error) {
      console.error("Create event error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to create event."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">

      <div className="form-container">

        <h1>Create Event</h1>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Event Title</label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter event title"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter event description"
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
              placeholder="https://example.com/event.jpg"
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
                placeholder="11:00 AM"
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
              placeholder="Enter venue"
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
                placeholder="500"
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
                placeholder="100"
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
              onClick={() => navigate("/events")}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Event"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default CreateEvent;