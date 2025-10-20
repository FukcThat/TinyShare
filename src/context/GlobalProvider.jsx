import { useEffect, useMemo, useState } from "react";
import { userData } from "../data/userData";
import { GlobalContext } from "./GlobalContext";
import { communityData } from "../data/communityData";
import { itemData } from "../data/itemData";
import { reservationData } from "../data/reservationData";
import { membershipData } from "../data/membershipData";

export function GlobalProvider({ children }) {
  const [user, setUser] = useState(userData[0]);
  const [items, setItems] = useState(itemData);
  const [reservations, setReservations] = useState(reservationData);
  const [memberships, setMemberships] = useState(membershipData);
  const [communities, setCommunities] = useState(communityData);
  const [activeCommunity, setActiveCommunity] = useState(null);

  const userCommunities = useMemo(() => {
    const communityIds = new Set();
    memberships.forEach(
      (memb) => memb.userId === user.id && communityIds.add(memb.communityId)
    );
    return communities.filter((comm) => communityIds.has(comm.id));
  }, [memberships, communities]);

  useEffect(() => {
    setActiveCommunity(userCommunities[1]);
  }, [userCommunities]);

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
    // here we should check if the owner cancelled or the reservee cancelled
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
        userCommunities,
        setCommunities,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
