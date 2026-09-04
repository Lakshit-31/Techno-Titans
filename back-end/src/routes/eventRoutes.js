const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyOrganiserEvents,
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole, requireApprovedOrganiser } = require('../middleware/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Event & Movie Listings, Filters & Management
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: List events with filters (city, category, search, isFeatured)
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city (e.g. Mumbai, Delhi, Bengaluru, Boston)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category slug or name (e.g. movies, concerts, comedy)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Text search in title, description, venue
 *       - in: query
 *         name: isFeatured
 *         schema:
 *           type: boolean
 *         description: Filter featured events for hero banner
 *     responses:
 *       200:
 *         description: List of event objects
 */
router.get('/', getEvents);

/**
 * @swagger
 * /events/organiser/my:
 *   get:
 *     summary: Get events created by logged-in organiser
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of organiser's own events
 */
router.get('/organiser/my', protect, requireRole('ORGANISER', 'ADMIN'), getMyOrganiserEvents);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get event details by ID with showtimes
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event details object with populated showtimes
 *       404:
 *         description: Event not found
 */
router.get('/:id', getEventById);

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create new event (Approved Organiser or Admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *               - city
 *               - venue
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               city:
 *                 type: string
 *               venue:
 *                 type: string
 *               bannerUrl:
 *                 type: string
 *               language:
 *                 type: string
 *               durationMinutes:
 *                 type: number
 *     responses:
 *       201:
 *         description: Event created successfully
 *       403:
 *         description: Organiser approval required
 */
router.post('/', protect, requireRole('ORGANISER', 'ADMIN'), requireApprovedOrganiser, createEvent);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update an event (Own event / Admin)
 *     tags: [Events]
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
 *         description: Event updated
 */
router.put('/:id', protect, requireRole('ORGANISER', 'ADMIN'), requireApprovedOrganiser, updateEvent);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete an event (Own event / Admin)
 *     tags: [Events]
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
 *         description: Event deleted
 */
router.delete('/:id', protect, requireRole('ORGANISER', 'ADMIN'), deleteEvent);

module.exports = router;
