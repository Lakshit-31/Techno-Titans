const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const bookings = require("../controllers/bookingController");

router.post("/", auth, bookings.createBooking);
router.get("/my-bookings", auth, bookings.getMyBookings);
router.get("/:id", auth, bookings.getBooking);
router.put("/:id/cancel", auth, bookings.cancelBooking);

module.exports = router;
