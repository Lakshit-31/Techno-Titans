const Review = require('../models/Review');

// @desc    Get all reviews for an event
const getEventReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ event: req.params.eventId })
      .populate('user', 'name city')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

// @desc    Add a review for an event
const createReview = async (req, res, next) => {
  try {
    const { eventId, rating, comment } = req.body;

    if (!eventId || !rating || !comment) {
      return res.status(400).json({ message: 'Event ID, rating, and comment are required' });
    }

    const review = await Review.create({
      user: req.user._id,
      event: eventId,
      rating: parseInt(rating, 10),
      comment,
    });

    const populated = await Review.findById(review._id).populate('user', 'name city');
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getEventReviews,
  createReview,
};
