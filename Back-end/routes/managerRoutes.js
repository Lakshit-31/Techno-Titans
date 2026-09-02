const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const { requireEventManager } = require("../middlewares/roleMiddleware");
const manager = require("../controllers/managerController");

router.get("/dashboard", auth, requireEventManager, manager.getDashboardStats);
router.get("/events", auth, requireEventManager, manager.getManagerEvents);
router.get("/events/:id/bookings", auth, requireEventManager, manager.getEventBookings);

module.exports = router;
