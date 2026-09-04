const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, cancelBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Ticket Checkout, Reservations & Booking History
 */

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Book tickets & simulate payment (User)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - showtimeId
 *               - numTickets
 *             properties:
 *               showtimeId:
 *                 type: string
 *               numTickets:
 *                 type: number
 *                 example: 2
 *     responses:
 *       201:
 *         description: Booking confirmed with unique bookingRef
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 */
router.post('/', protect, createBooking);

/**
 * @swagger
 * /bookings/my:
 *   get:
 *     summary: Get logged-in user's booking history
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of user's past & upcoming bookings
 */
router.get('/my', protect, getMyBookings);

/**
 * @swagger
 * /bookings/{id}/cancel:
 *   put:
 *     summary: Cancel a booking and restore showtime seats
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking status updated to CANCELLED
 */
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
