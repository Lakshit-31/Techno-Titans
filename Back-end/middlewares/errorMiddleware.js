const notFound = (req, res) => res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });

const errorHandler = (err, _req, res, _next) => {
  console.error(err);
  if (err.name === "CastError") return res.status(400).json({ message: "Invalid resource identifier" });
  if (err.code === 11000) return res.status(409).json({ message: "That seat has just been booked. Please choose another seat." });
  res.status(err.status || 500).json({ message: err.message || "Server error" });
};

module.exports = { notFound, errorHandler };
