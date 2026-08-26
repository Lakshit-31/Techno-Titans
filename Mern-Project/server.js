const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const eventRoutes = require("./src/routes/event.route");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/events", eventRoutes);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Event Management API is running",
  });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });