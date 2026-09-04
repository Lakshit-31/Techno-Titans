const express = require('express');
const router = express.Router();
const { getEventReviews, createReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Post-event Ratings & Reviews
 */

/**
 * @swagger
 * /reviews/event/{eventId}:
 *   get:
 *     summary: Get reviews for an event
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of reviews for the event
 */
router.get('/event/:eventId', getEventReviews);

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Submit a rating and review for an event
 *     tags: [Reviews]
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
 *               - rating
 *               - comment
 *             properties:
 *               eventId:
 *                 type: string
 *               rating:
 *                 type: number
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: Incredible production quality and sound!
 *     responses:
 *       201:
 *         description: Review submitted
 */
router.post('/', protect, createReview);

module.exports = router;
