import { useEffect, useMemo, useState } from "react";
import { GlobalContext } from "./GlobalContext";
import { Membership } from "../data/membershipData";
import { v4 as uuidv4 } from "uuid";
import { useSession } from "./session_context/useSession";
import { mockApi } from "../../mocks";

export function GlobalProvider({ children }) {
  const { user, userCommunities } = useSession();
  const [activeCommunity, setActiveCommunity] = useState(null);
  const [communityMembers, setCommunityMembers] = useState(null);
  const [items, setItems] = useState(null);
  const [reservations, setReservations] = useState(null);
  const [invitations, setInvitations] = useState(null);

  useEffect(() => {
    if (!activeCommunity) return;
    mockApi
      .getCommunityData(activeCommunity.id)
      .then((data) => {
        setItems(data.items);
        setCommunityMembers(data.members);
        setReservations(data.reservations);
        setInvitations(data.invitations);
      })
      .catch((err) => console.error(err))
      .finally(() => {});
  }, [activeCommunity]); // active community changes, fetch data

  const userRole = useMemo(() => {
    if (!activeCommunity || !communityMembers) return null;
    return communityMembers.find((member) => member.id === user.id).role;
  }, [activeCommunity, user, communityMembers]);

  const userInvites = useMemo(
    () =>
      !user
        ? null
        : !invitations
        ? null
        : invitations.filter((invite) => invite.inviteeId == user.id),
    [invitations, user]
  );

  useEffect(
    () =>
      setActiveCommunity(userCommunities.length ? userCommunities[0] : null),
    [userCommunities]
  ); // Fix how this works later -T

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

  const AcceptCommunityInvitation = (communityId, role, inviteId) => {
    // new membership
    const newMemberhsip = new Membership(uuidv4(), user.id, communityId, role);

    setMemberships((oldMemberships) => [...oldMemberships, newMemberhsip]);
    // delete invitation

    DeleteCommunityInvitation(inviteId);
  };

  const DeleteCommunityInvitation = (inviteId) => {
    setInvitations((oldInvitations) =>
      oldInvitations.filter((invite) => invite.id !== inviteId)
    );
  };

  return (
    <GlobalContext.Provider
      value={{
        activeCommunity,
        setActiveCommunity,
        items,
        setItems,
        reservations,
        setReservations,
        userRole,
        communityMembers,
        ToggleRole,
        KickMember,
        userInvites,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
