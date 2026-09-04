const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    organiser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    bannerUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000',
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      index: true,
    },
    citySlug: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
    },
    eventLanguage: {
      type: String,
      default: 'English',
    },
    durationMinutes: {
      type: Number,
      default: 120,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'UNPUBLISHED'],
      default: 'PUBLISHED',
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

eventSchema.pre('save', function (next) {
  if (this.city) {
    this.city = this.city.trim();
    this.citySlug = this.city.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  next();
});

eventSchema.index({ title: 'text', description: 'text', city: 'text' }, { language_override: 'none' });

module.exports = mongoose.model('Event', eventSchema);
