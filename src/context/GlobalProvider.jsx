import { useEffect, useMemo, useState } from "react";
import { userData } from "../data/userData";
import { GlobalContext } from "./GlobalContext";
import { communityData, NoCommunity } from "../data/communityData";
import { itemData } from "../data/itemData";
import { reservationData } from "../data/reservationData";
import { membershipData } from "../data/membershipData";

export function GlobalProvider({ children }) {
  const [user, setUser] = useState(userData[0]);
  const [allUsers, setAllUsers] = useState(userData);
  const [items, setItems] = useState([]);
  const [reservations, setReservations] = useState(reservationData);
  const [memberships, setMemberships] = useState(membershipData);
  const [communities, setCommunities] = useState(communityData);
  const [activeCommunity, setActiveCommunity] = useState(null);

  const communityMembers = useMemo(() => {
    if (!activeCommunity) return [];

    return allUsers
      .filter((thisUser) => {
        return memberships.some((membership) => {
          return (
            membership.userId == thisUser.id &&
            membership.communityId == activeCommunity.id
          );
        });
      })
      .map((user) => {
        return {
          ...user,
          role: memberships.find((mem) => mem.userId === user.id).role,
        };
      });
  }, [activeCommunity, memberships]);

  const userCommunities = useMemo(() => {
    const res = communities.filter((community) =>
      memberships.some(
        (membership) =>
          membership.userId === user.id &&
          membership.communityId === community.id
      )
    );
    return res.length === 0 ? [NoCommunity] : res;
  }, [memberships, communities]);

  const activeMembership = useMemo(() => {
    if (!activeCommunity) return undefined;

    return memberships.find((membership) => {
      return (
        membership.userId == user.id &&
        membership.communityId == activeCommunity.id
      );
    });
  }, [memberships, activeCommunity, user]);

  useEffect(() => setActiveCommunity(userCommunities[0]), [userCommunities]);

  useEffect(() => {
    if (!activeCommunity) {
      setItems([]);
      return;
    }

    setItems(
      itemData.filter((item) =>
        memberships.some(
          (m) => m.userId === item.owner && m.communityId === activeCommunity.id
        )
      )
    );
  }, [activeCommunity]);

  // Item Functions
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

  // Membership Functions
  const ToggleRole = (userId) => {
    setMemberships((oldMemberships) =>
      oldMemberships.map((membership) => {
        if (
          membership.userId == userId &&
          membership.communityId == activeCommunity.id
        ) {
          return {
            ...membership,
            role: membership.role == "admin" ? "member" : "admin",
          };
        } else {
          return membership;
        }
      })
    );
  };

  const KickMember = (userId) => {
    setMemberships((oldMemberships) => {
      return oldMemberships.filter(
        (membership) =>
          !(
            membership.userId == userId &&
            membership.communityId == activeCommunity.id
          )
      );
    });
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
        setMemberships,
        memberships,
        activeMembership,
        communityMembers,
        ToggleRole,
        KickMember,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
