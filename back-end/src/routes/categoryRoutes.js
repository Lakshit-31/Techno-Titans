const express = require('express');
const router = express.Router();
const { getCategories, createCategory } = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Event & Movie categories (Movies, Concerts, Comedy, Sports, etc.)
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get list of all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of category objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get('/', getCategories);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create new category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Standup Comedy
 *     responses:
 *       201:
 *         description: Category created
 *       403:
 *         description: Admin access required
 */
router.post('/', protect, requireRole('ADMIN'), createCategory);

module.exports = router;
