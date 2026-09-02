const Event = require("../models/Event");
const Booking = require("../models/Booking");

exports.listEvents = async (req, res) => {
  try {
    const { category, location, date, maxPrice } = req.query;
    
    // Public users only see published events
    const filter = { status: "published" };
    
    if (category) filter.category = new RegExp(category, "i");
    if (location) filter.location = new RegExp(location, "i");
    if (maxPrice) filter.ticketPrice = { $lte: Number(maxPrice) };
    if (date) {
      const queryDate = new Date(date);
      filter.date = {
        $gte: new Date(queryDate.setHours(0, 0, 0, 0)),
        $lte: new Date(queryDate.setHours(23, 59, 59, 999))
      };
    }

    const events = await Event.find(filter).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, status: "published" }).populate("createdBy", "name");
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { title, description, category, date, startTime, endTime, location, ticketPrice, totalTickets, image } = req.body;
    
    if (!title || !date || !ticketPrice || !totalTickets) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (ticketPrice < 0) return res.status(400).json({ message: "Ticket price cannot be negative" });
    if (totalTickets < 1) return res.status(400).json({ message: "Total tickets must be at least 1" });

    const event = new Event({
      title,
      description,
      category,
      date,
      startTime,
      endTime,
      location,
      ticketPrice,
      totalTickets,
      availableTickets: totalTickets,
      image,
      createdBy: req.user.id,
      status: "published"
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    
    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: You do not own this event" });
    }

    const { title, description, category, date, startTime, endTime, location, ticketPrice, totalTickets, image, status } = req.body;
    
    if (totalTickets !== undefined) {
      if (totalTickets < event.soldTickets) {
        return res.status(400).json({ message: "Total tickets cannot be less than already sold tickets" });
      }
      event.availableTickets = totalTickets - event.soldTickets;
      event.totalTickets = totalTickets;
    }

    if (title) event.title = title;
    if (description) event.description = description;
    if (category) event.category = category;
    if (date) event.date = date;
    if (startTime) event.startTime = startTime;
    if (endTime) event.endTime = endTime;
    if (location) event.location = location;
    if (ticketPrice !== undefined) event.ticketPrice = ticketPrice;
    if (image) event.image = image;
    if (status) event.status = status;

    await event.save();
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: You do not own this event" });
    }

    if (event.soldTickets > 0) {
      return res.status(400).json({ message: "Cannot delete an event that has sold tickets. Consider cancelling it instead." });
    }

    await event.deleteOne();
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
