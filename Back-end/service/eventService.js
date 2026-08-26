const Event = require("../models/eventModel");

const createEvent = async (eventData) => {
  return Event.create(eventData);
};

const getAllEvents = async () => {
  return Event.find()
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });
};

const getEventById = async (id) => {
  return Event.findById(id).populate("createdBy", "name email");
};

const updateEvent = async (id, eventData) => {
  return Event.findByIdAndUpdate(id, eventData, {
    new: true,
    runValidators: true,
  });
};

const deleteEvent = async (id) => {
  return Event.findByIdAndDelete(id);
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};