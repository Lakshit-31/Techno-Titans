const Event = require('../models/Event');
const Category = require('../models/Category');
const Showtime = require('../models/Showtime');

// @desc    Get all events with search, category, city filters and sorting
const getEvents = async (req, res, next) => {
  try {
    const { category, city, search, isFeatured, status } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    } else {
      query.status = 'PUBLISHED';
    }

    if (city && city.trim() && city !== 'All Cities' && city.toLowerCase() !== 'all') {
      const cleanCity = city.trim();
      const escapedCity = cleanCity.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const citySlug = cleanCity.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { city: { $regex: new RegExp(`^${escapedCity}$`, 'i') } },
          { citySlug: citySlug },
        ],
      });
    }

    if (isFeatured === 'true') {
      query.isFeatured = true;
    }

    if (category) {
      // Find category by slug or id
      const catObj = await Category.findOne({
        $or: [{ slug: category.toLowerCase() }, { name: new RegExp(category, 'i') }],
      });
      if (catObj) {
        query.category = catObj._id;
      }
    }

    if (search) {
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { venue: { $regex: search, $options: 'i' } },
        ],
      });
    }

    const events = await Event.find(query)
      .populate('category', 'name slug')
      .populate('organiser', 'name email city')
      .sort({ createdAt: -1 });

    res.json(events);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single event by ID with showtimes
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('organiser', 'name email city phone');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const showtimes = await Showtime.find({ event: event._id }).sort({ dateTime: 1 });

    res.json({
      ...event.toObject(),
      showtimes,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new event
const createEvent = async (req, res, next) => {
  try {
    const { title, description, category, bannerUrl, city, venue, language, durationMinutes, isFeatured } = req.body;

    if (!title || !description || !category || !city || !venue) {
      return res.status(400).json({ message: 'Title, description, category, city, and venue are required' });
    }

    const cleanCity = city.trim();
    const citySlug = cleanCity.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const event = await Event.create({
      organiser: req.user._id,
      title,
      description,
      category,
      bannerUrl: bannerUrl || undefined,
      city: cleanCity,
      citySlug,
      venue,
      eventLanguage: req.body.eventLanguage || req.body.language || 'English',
      durationMinutes: durationMinutes || 120,
      status: 'PUBLISHED',
      isFeatured: isFeatured || false,
    });

    const populatedEvent = await Event.findById(event._id)
      .populate('category', 'name slug')
      .populate('organiser', 'name email');

    res.status(201).json(populatedEvent);
  } catch (err) {
    next(err);
  }
};

// @desc    Update an event
const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Role check: Only owner or admin can update
    if (event.organiser.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to edit this event' });
    }

    const fields = ['title', 'description', 'category', 'bannerUrl', 'city', 'venue', 'eventLanguage', 'language', 'durationMinutes', 'status', 'isFeatured'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'language' || field === 'eventLanguage') {
          event.eventLanguage = req.body[field];
        } else if (field === 'city') {
          event.city = req.body.city.trim();
          event.citySlug = req.body.city.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
        } else {
          event[field] = req.body[field];
        }
      }
    });

    const updatedEvent = await event.save();
    const populated = await Event.findById(updatedEvent._id)
      .populate('category', 'name slug')
      .populate('organiser', 'name email');

    res.json(populated);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete an event
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organiser.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    // Cascading deletion of associated showtimes
    await Showtime.deleteMany({ event: event._id });
    await Event.findByIdAndDelete(req.params.id);

    res.json({ message: 'Event and associated showtimes deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// @desc    Get organiser's own events
const getMyOrganiserEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ organiser: req.user._id })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });

    res.json(events);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyOrganiserEvents,
};
