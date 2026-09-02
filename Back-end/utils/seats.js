const rows = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const generateSeatIds = (totalSeats) => Array.from({ length: totalSeats }, (_, index) => {
  const row = rows[Math.floor(index / 10)];
  return `${row}${(index % 10) + 1}`;
});

const validSeatIds = (seats, totalSeats) => {
  const allowed = new Set(generateSeatIds(totalSeats));
  return Array.isArray(seats) && seats.length > 0 && new Set(seats).size === seats.length && seats.every((seat) => allowed.has(seat));
};

module.exports = { generateSeatIds, validSeatIds };
