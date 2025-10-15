export class Reservation {
  constructor(id, userId, itemId, startDate, endDate, status = "request") {
    this.id = id;
    this.userId = userId;
    this.itemId = itemId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.status = status;
  }
}

export const reservationData = [
  new Reservation(
    0,
    2,
    1,
    "2025-10-12T14:45:00",
    "2025-10-15T11:30:00",
    "booking"
  ),
  new Reservation(1, 3, 1, "2025-10-16T12:00:00", "2025-10-16T13:00:00"),
];
