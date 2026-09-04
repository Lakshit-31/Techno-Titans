const express = require('express');
const router = express.Router();
const { getSeatsByShowtime } = require('../controllers/seatController');

router.get('/showtime/:showtimeId', getSeatsByShowtime);

module.exports = router;
