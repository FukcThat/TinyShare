import { useState } from "react";
import { userData } from "../data/userData";
import { GlobalContext } from "./GlobalContext";
import { communityData } from "../data/communityData";
import { itemData } from "../data/itemData";
import { reservationData } from "../data/reservationData";

export function GlobalProvider({ children }) {
  const [user, setUser] = useState(userData[1]);
  const [items, setItems] = useState(itemData);
  const [reservations, setReservations] = useState(reservationData);
  const [activeCommunity, setActiveCommunity] = useState(communityData[0]);

  const UpdateItem = (id, newData) => {
    setItems((oldItems) =>
      oldItems.map((item) => {
        if (item.id === id)
          return {
            ...item,
            name: newData.name,
            isAvailable: newData.isAvailable,
          };
        return item;
      })
    );
  };

  const DeleteItem = (id) => {
    setItems((oldItems) => oldItems.filter((item) => item.id !== id));
  };

  const ApproveReservation = (resId) => {
    setReservations((oldReservations) =>
      oldReservations.map((res) =>
        res.id != resId ? res : { ...res, status: "booking" }
      )
    );
  };

  const DenyReservation = (resId) => {
    setReservations((oldReservations) =>
      oldReservations.filter((res) => res.id != resId)
    );
  };

  const CancelReservationRequest = (resId) => {
    setReservations((oldReservations) =>
      oldReservations.filter((res) => res.id != resId)
    );
  };

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        activeCommunity,
        setActiveCommunity,
        items,
        setItems,
        UpdateItem,
        DeleteItem,
        reservations,
        setReservations,
        ApproveReservation,
        DenyReservation,
        CancelReservationRequest,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
