export class Reservation {
  constructor(id, userId, itemId, startDate, endDate) {
    this.id = id;
    this.userId = userId;
    this.itemId = itemId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.status = "request";
  }
}

export const reservationData = [
  new Reservation(1, 2, 1, "2025-10-12T14:45:00", "2025-10-15T11:30:00"),
  new Reservation(1, 3, 1, "2025-10-16", "2025-10-20"),
];
