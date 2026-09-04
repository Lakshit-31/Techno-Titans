const City = require('../models/City');

// @desc    Get all cities (Optionally filter active ones for public)
// @route   GET /api/cities
// @access  Public
const getCities = async (req, res, next) => {
  try {
    const { includeInactive } = req.query;
    const filter = includeInactive === 'true' ? {} : { isActive: true };
    const cities = await City.find(filter).sort({ name: 1 });
    res.json(cities);
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new city
// @route   POST /api/cities
// @access  Private/Admin
const createCity = async (req, res, next) => {
  try {
    const { name, slug, isActive } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'City name is required' });
    }

    const citySlug = (slug || name).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    const existing = await City.findOne({ $or: [{ name }, { slug: citySlug }] });
    if (existing) {
      return res.status(400).json({ message: 'City already exists with this name or slug' });
    }

    const city = await City.create({
      name: name.trim(),
      slug: citySlug,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json(city);
  } catch (err) {
    next(err);
  }
};

// @desc    Update a city
// @route   PUT /api/cities/:id
// @access  Private/Admin
const updateCity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, slug, isActive } = req.body;

    const city = await City.findById(id);
    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }

    if (name) city.name = name.trim();
    if (slug) city.slug = slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    if (isActive !== undefined) city.isActive = isActive;

    const updated = await city.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a city
// @route   DELETE /api/cities/:id
// @access  Private/Admin
const deleteCity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const city = await City.findByIdAndDelete(id);
    if (!city) {
      return res.status(404).json({ message: 'City not found' });
    }
    res.json({ message: 'City deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCities,
  createCity,
  updateCity,
  deleteCity,
};
