export const HasReservationConflict = (reservations, startDate, endDate) => {
  return reservations.some((reservation) => {
    const reservationStartDate = new Date(
      reservation.start || reservation.startDate
    );
    const reservationEndDate = new Date(reservation.end || reservation.endDate);

    // overlap occurs unless one ends before the other starts
    const noConflict =
      reservationEndDate.getTime() <= startDate.getTime() ||
      reservationStartDate.getTime() >= endDate.getTime();

    return !noConflict;
  });
};
