import { useEffect, useState } from "react";
import { GlobalContext } from "./GlobalContext";
import { useSession } from "./session_context/useSession";
import Loading from "../components/global/Loading";
import { listenForMembershipChanges, supabase } from "../lib/supabaseClient";
import useCommunityInvitations from "../hooks/useCommunityInvitations";
import useCommunityMembers from "../hooks/useCommunityMembers";

export function GlobalProvider({ children }) {
  const { userCommunities, session } = useSession();
  const [activeCommunity, setActiveCommunity] = useState(null);
  const [communityMembers, setCommunityMembers] =
    useCommunityMembers(activeCommunity);
  const [items, setItems] = useState(null);
  const [communityInvitations, setCommunityInvitations] =
    useCommunityInvitations(activeCommunity);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!activeCommunity) return;

    const channel = listenForMembershipChanges(
      activeCommunity.id,
      (payload) => {
        if (payload.eventType === "INSERT") {
          console.log("INSERT: ", payload);
          if (payload.new.community_id !== activeCommunity.id) return;
          UpdateCommunityData();
        } else if (payload.eventType === "DELETE") {
          setCommunityMembers((prevMembers) => {
            const match = prevMembers.some(
              (member) => member.membership_id === payload.old.id
            );
            if (match) {
              UpdateCommunityData();
            }
            return prevMembers;
          });
          console.log("DELETE : ", payload);
        }
      }
    );

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeCommunity]);

  const UpdateCommunityData = () => {
    supabase
      .from("communities")
      .select(
        `
      id,
      name, 
      invitations (
      *, 
      profiles!invitations_invitee_id_fkey(*)
      ),
      memberships(
        id,
        user_id,
        role,
        profiles(
          id,
          name,
          email, 
          items(
            id,
            name, 
            owner,
            is_available,
            item_reservations(*)
          )
        )
      )
      `
      )
      .eq("id", activeCommunity.id)
      .single()
      .then((res) => {
        const items = res.data.memberships
          .map((member) => member.profiles.items)
          .flat();

        setItems(items);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (!activeCommunity || activeCommunity.id === -1) return;
    setIsLoading(true);
    UpdateCommunityData();
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
