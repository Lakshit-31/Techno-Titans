const express = require('express');
const router = express.Router();
const { getShowtimesByEvent, createShowtime } = require('../controllers/showtimeController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole, requireApprovedOrganiser } = require('../middleware/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Showtimes
 *   description: Event dates, showtimes, seat availability & pricing
 */

/**
 * @swagger
 * /showtimes/event/{eventId}:
 *   get:
 *     summary: Get all showtimes for a specific event
 *     tags: [Showtimes]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of showtimes for the event
 */
router.get('/event/:eventId', getShowtimesByEvent);

/**
 * @swagger
 * /showtimes:
 *   post:
 *     summary: Create a new showtime (Organiser/Admin)
 *     tags: [Showtimes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *               - dateTime
 *               - price
 *               - totalSeats
 *             properties:
 *               eventId:
 *                 type: string
 *               dateTime:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-09-10T18:30:00.000Z
 *               price:
 *                 type: number
 *                 example: 450
 *               totalSeats:
 *                 type: number
 *                 example: 150
 *     responses:
 *       201:
 *         description: Showtime created
 */
router.post('/', protect, requireRole('ORGANISER', 'ADMIN'), requireApprovedOrganiser, createShowtime);

module.exports = router;
