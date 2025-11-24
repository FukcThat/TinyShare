import { useEffect, useState } from "react";
import { GlobalContext } from "./GlobalContext";
import useCommunityItems from "../hooks/useCommunityItems";
import useUserCommunities from "../hooks/tanstack_queries/useUserCommunities";

export function GlobalProvider({ children }) {
  const { data: userCommunities } = useUserCommunities();
  const [activeCommunity, setActiveCommunity] = useState(null);
  const [communityItems, setCommunityItems] =
    useCommunityItems(activeCommunity);

  useEffect(() => {
    if (!userCommunities || userCommunities.length === 0) return;

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

  return (
    <GlobalContext.Provider
      value={{
        activeCommunity,
        setActiveCommunity,
        communityItems,
        setCommunityItems,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
