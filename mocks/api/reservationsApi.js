import { reservations } from "../db/reservations";
import { delay, lsKeys } from "../utils";
import { v4 as uuidv4 } from "uuid";

export const reservationsApi = {
  async getAll() {
    await delay();
    return [...reservations];
  },

  async createReservation(data) {
    await delay();

    const newReservation = {
      id: uuidv4(),
      userId: data.userId,
      itemId: data.itemId,
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status,
    };

    reservations.push(newReservation);

    localStorage.setItem(lsKeys.reservations, JSON.stringify(reservations));

    return { ok: true, newReservation };
  },

  async approveReservation(reservationId) {
    let updatedReservation = null;

    for (let i = 0; i < reservations.length; i++) {
      if (reservations[i].id === reservationId) {
        updatedReservation = { ...reservations[i], status: "booking" };
        reservations[i] = updatedReservation;
      }
    }
    if (!updatedReservation)
      return { ok: false, message: "Updating Reservation failed on server" };

    localStorage.setItem(lsKeys.reservations, JSON.stringify(reservations));

    return { ok: true, updatedReservation };
  },

  async cancelReservation(reservationId) {
    let idx = null;
    for (let i = 0; i < reservations.length; i++) {
      if (reservations[i].id === reservationId) idx = i;
    }
    if (idx === null)
      return { ok: false, message: "Deny Reservation failed on server" };
    reservations.splice(idx, 1);

    localStorage.setItem(lsKeys.reservations, JSON.stringify(reservations));

    return { ok: true };
  },
};
