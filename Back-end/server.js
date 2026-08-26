const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
if (!process.env.MONGO_URI) {
  dotenv.config({ path: path.resolve(__dirname, "../Mern-Project/.env") });
}

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/event.route");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.get("/", (req, res) => {
  res.send("EventHub Backend is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
