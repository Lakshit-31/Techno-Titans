const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const { requireEventManager } = require("../middlewares/roleMiddleware");
const events = require("../controllers/eventController");

router.get("/", events.listEvents);
router.get("/:id", events.getEvent);
router.post("/", auth, requireEventManager, events.createEvent);
router.put("/:id", auth, requireEventManager, events.updateEvent);
router.delete("/:id", auth, requireEventManager, events.deleteEvent);

module.exports = router;
