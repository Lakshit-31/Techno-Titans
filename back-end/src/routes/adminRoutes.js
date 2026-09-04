const express = require('express');
const router = express.Router();
const {
  getStats,
  getUsers,
  updateUserStatus,
  getPendingOrganisers,
  approveOrganiser,
  rejectOrganiser,
  getAllEvents,
  toggleFeatureEvent,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(requireRole('ADMIN'));

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: System-wide Administration, Organiser Approvals & Analytics
 */

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Get platform analytics overview
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overview counters and total revenue
 */
router.get('/stats', getStats);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all registered users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of users
 */
router.get('/users', getUsers);

/**
 * @swagger
 * /admin/users/{id}/status:
 *   put:
 *     summary: Update user role or account status
 *     tags: [Admin]
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
 *         description: User status updated
 */
router.put('/users/:id/status', updateUserStatus);

/**
 * @swagger
 * /admin/organisers/pending:
 *   get:
 *     summary: Get pending organiser approval requests
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of pending organisers
 */
router.get('/organisers/pending', getPendingOrganisers);

/**
 * @swagger
 * /admin/organisers/{id}/approve:
 *   put:
 *     summary: Approve an organiser account
 *     tags: [Admin]
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
 *         description: Organiser approved
 */
router.put('/organisers/:id/approve', approveOrganiser);

/**
 * @swagger
 * /admin/organisers/{id}/reject:
 *   put:
 *     summary: Reject an organiser account
 *     tags: [Admin]
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
 *         description: Organiser rejected
 */
router.put('/organisers/:id/reject', rejectOrganiser);

/**
 * @swagger
 * /admin/events:
 *   get:
 *     summary: Get all events across platform
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of all events
 */
router.get('/events', getAllEvents);

/**
 * @swagger
 * /admin/events/{id}/feature:
 *   put:
 *     summary: Toggle featured status of an event for homepage banner
 *     tags: [Admin]
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
 *         description: Featured status toggled
 */
router.put('/events/:id/feature', toggleFeatureEvent);

module.exports = router;
