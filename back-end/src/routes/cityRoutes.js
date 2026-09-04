const express = require('express');
const router = express.Router();
const { getCities, createCity, updateCity, deleteCity } = require('../controllers/cityController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

router.get('/', getCities);
router.post('/', protect, requireRole('ADMIN'), createCity);
router.put('/:id', protect, requireRole('ADMIN'), updateCity);
router.delete('/:id', protect, requireRole('ADMIN'), deleteCity);

module.exports = router;
