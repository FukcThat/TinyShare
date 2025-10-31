import { useEffect, useState } from "react";
import { GlobalContext } from "./GlobalContext";
import { useSession } from "./session_context/useSession";
import { mockApi } from "../../mocks";
import Loading from "../components/global/Loading";

export function GlobalProvider({ children }) {
  const { user, userCommunities } = useSession();
  const [userRole, setUserRole] = useState(null);
  const [activeCommunity, setActiveCommunity] = useState(null);
  const [communityMembers, setCommunityMembers] = useState(null);
  const [items, setItems] = useState(null);
  const [reservations, setReservations] = useState(null);
  const [invitations, setInvitations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!activeCommunity) return;
    setIsLoading(true);
    mockApi
      .getCommunityData(activeCommunity.id, user.id)
      .then((data) => {
        setItems(data.items);
        setCommunityMembers(data.members);
        setReservations(data.reservations);
        setInvitations(data.invitations);
        setUserRole(data.userRole);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [activeCommunity]); // active community changes, fetch data

  useEffect(() => {
    setActiveCommunity(userCommunities.length ? userCommunities[0] : null);
  }, [userCommunities]); // Fix how this works later -T

  return isLoading ? (
    <Loading />
  ) : (
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
        setCommunityMembers,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
