import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const clearBookingDraft = () => {
    setSelectedShowtime(null);
    setSelectedEvent(null);
    setTicketQuantity(1);
    setSelectedSeats([]);
  };

  return (
    <BookingContext.Provider
      value={{
        selectedShowtime,
        setSelectedShowtime,
        selectedEvent,
        setSelectedEvent,
        ticketQuantity,
        setTicketQuantity,
        selectedSeats,
        setSelectedSeats,
        clearBookingDraft,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
