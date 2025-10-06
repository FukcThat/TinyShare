export class Reservation {
  constructor(id, userId, itemId, startDate, endDate) {
    this.id = id;
    this.userId = userId;
    this.itemId = itemId;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}

export const reservationData = [
  new Reservation(1, 1, 2, new Date().toISOString(), new Date().toISOString()),
];
