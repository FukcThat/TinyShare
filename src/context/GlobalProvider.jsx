import { useEffect, useState } from "react";
import { GlobalContext } from "./GlobalContext";
import { useSession } from "./session_context/useSession";
import Loading from "../components/global/Loading";
import useCommunityInvitations from "../hooks/useCommunityInvitations";
import useCommunityMembers from "../hooks/useCommunityMembers";
import useCommunityItems from "../hooks/useCommunityItems";

export function GlobalProvider({ children }) {
  const { userCommunities } = useSession();
  const [activeCommunity, setActiveCommunity] = useState(null);
  const [communityMembers, setCommunityMembers] =
    useCommunityMembers(activeCommunity);
  const [communityItems, setCommunityItems] = useCommunityItems(
    activeCommunity,
    communityMembers
  );
  const [communityInvitations, setCommunityInvitations] =
    useCommunityInvitations(activeCommunity);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userCommunities) return;

    let lsCommunity = localStorage.getItem("tiny-share-active-community-id");

    if (
      lsCommunity != null &&
      userCommunities.find((com) => com.id === lsCommunity)
    ) {
      setActiveCommunity(userCommunities.find((com) => com.id == lsCommunity));
    } else {
      setActiveCommunity(userCommunities[0]);
      localStorage.setItem(
        "tiny-share-active-community-id",
        userCommunities[0].id
      );
    }
  }, [userCommunities]); // Fix how this works later -T

  return isLoading ? (
    <Loading />
  ) : (
    <GlobalContext.Provider
      value={{
        activeCommunity,
        setActiveCommunity,
        communityItems,
        setCommunityItems,
        communityMembers,
        setCommunityMembers,
        communityInvitations,
        setCommunityInvitations,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
