export const HasReservationConflict = (reservations, startDate, endDate) => {
  return reservations.some((reservation) => {
    const reservationStartDate = new Date(reservation.start);
    const reservationEndDate = new Date(reservation.end);

    return (
      (reservationStartDate > startDate && reservationStartDate < endDate) ||
      (reservationEndDate > startDate && reservationEndDate < endDate)
    );
  });
};
