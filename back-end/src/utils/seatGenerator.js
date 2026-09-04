const Seat = require('../models/Seat');

const DEFAULT_ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];

const generateSeatsForShowtime = async (showtimeId, config = {}) => {
  const rows = config.rows || DEFAULT_ROWS;
  const leftCount = config.seatsPerRowLeft || 8;
  const rightCount = config.seatsPerRowRight || 8;

  const seatsToInsert = [];

  for (const row of rows) {
    // Left block
    for (let num = 1; num <= leftCount; num++) {
      let seatType = 'REGULAR';
      if (row === 'A') {
        if (num === 1 || num === 2) seatType = 'WHEELCHAIR';
        else if (num === 3 || num === 4) seatType = 'COMPANION';
      }

      seatsToInsert.push({
        showtime: showtimeId,
        row,
        number: num,
        section: 'left',
        seatType,
        status: 'AVAILABLE',
        booking: null,
      });
    }

    // Right block
    for (let num = leftCount + 1; num <= leftCount + rightCount; num++) {
      let seatType = 'REGULAR';
      if (row === 'A') {
        if (num === leftCount + 1 || num === leftCount + 2) seatType = 'WHEELCHAIR';
        else if (num === leftCount + 3 || num === leftCount + 4) seatType = 'COMPANION';
      }

      seatsToInsert.push({
        showtime: showtimeId,
        row,
        number: num,
        section: 'right',
        seatType,
        status: 'AVAILABLE',
        booking: null,
      });
    }
  }

  await Seat.insertMany(seatsToInsert);
  return seatsToInsert.length;
};

module.exports = {
  generateSeatsForShowtime,
  DEFAULT_ROWS,
};
