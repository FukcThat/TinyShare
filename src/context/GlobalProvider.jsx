import { useEffect, useState } from "react";
import { GlobalContext } from "./GlobalContext";
import { useSession } from "./session_context/useSession";
import Loading from "../components/global/Loading";
import { supabase } from "../lib/supabaseClient";

export function GlobalProvider({ children }) {
  const { userCommunities } = useSession();
  const [activeCommunity, setActiveCommunity] = useState(null);
  const [communityMembers, setCommunityMembers] = useState(null);
  const [items, setItems] = useState(null);
  const [invitations, setInvitations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => console.log(invitations), [invitations]);

  useEffect(() => {
    if (!activeCommunity) return;
    setIsLoading(true);

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
        console.log(res);
        // set the items, reservations are part of the items
        const members = res.data.memberships.map((member) => {
          return {
            id: member.profiles.id,
            role: member.role,
            email: member.profiles.email,
          };
        });
        const items = res.data.memberships
          .map((member) => member.profiles.items)
          .flat();

        const invitations = res.data.invitations;
        setItems(items);
        setCommunityMembers(members);
        setInvitations(invitations);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
    // set invitations
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
        invitations,
        setInvitations,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
