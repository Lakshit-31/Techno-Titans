const Event = require("../models/eventModel");

const createEvent = async (eventData) => {
  const event = await Event.create(eventData);

  return event;
};

const getAllEvents = async () => {
  const events = await Event.find()
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  return events;
};

const getEventById = async (id) => {
  const event = await Event.findById(id)
    .populate("createdBy", "name email");

  return event;
};

const updateEvent = async (id, eventData) => {
  const event = await Event.findByIdAndUpdate(
    id,
    eventData,
    {
      new: true,
      runValidators: true,
    }
  );

  return event;
};

const deleteEvent = async (id) => {
  const event = await Event.findByIdAndDelete(id);

  return event;
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};