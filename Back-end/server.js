const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
<<<<<<< Updated upstream
const userRoutes = require("./routes/userRoutes");
=======
const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const managerRoutes = require("./routes/managerRoutes");

const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

>>>>>>> Stashed changes
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/manager", managerRoutes);

app.get("/", (req, res) => {
  res.send("EventHub Backend is running");
});

const PORT = process.env.PORT || 5000;

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});