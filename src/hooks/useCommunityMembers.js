import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function useCommunityMembers(activeCommunity) {
  const [communityMembers, setCommunityMembers] = useState(null);

  const UpdateCommunityMembers = () => {
    // supabase call
    supabase
      .from("memberships")
      .select("id, role, profiles(id, email)")
      .eq("community_id", activeCommunity.id)
      .then((res) => {
        setCommunityMembers(res.data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (!activeCommunity) return;

    UpdateCommunityMembers();

    const channel = listenForCommunityMembershipChanges(
      activeCommunity.id,
      (payload) => {
        UpdateCommunityMembers();
      }
    );

    return () => supabase.removeChannel(channel);
  }, [activeCommunity]);

  return [communityMembers, setCommunityMembers];
}

function listenForCommunityMembershipChanges(communityId, onChange) {
  const channel = supabase
    .channel(`communityMemberships-${communityId}`)
    .on(
      "postgres_changes",
      {
        event: "*", // can be 'INSERT', 'UPDATE', 'DELETE'
        schema: "public",
        table: "memberships",
        filter: `community_id=eq.${communityId}`,
      },
      (payload) => {
        console.log("🔄 Community Invitations change:", payload);
        onChange(payload);
      }
    )
    .subscribe();

  return channel;
}
