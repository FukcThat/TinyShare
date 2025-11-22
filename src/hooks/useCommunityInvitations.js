import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function useCommunityInvitations(activeCommunity) {
  const [communityInvitations, setCommunityInvitations] = useState(null);

  const UpdateCommunityInvitations = () => {
    supabase
      .from("invitations")
      .select(
        `*,
      profiles!invitations_invitee_id_fkey(*)
      `
      )
      .eq("community_id", activeCommunity.id)
      .then((res) => {
        setCommunityInvitations(res.data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (!activeCommunity || activeCommunity.id === -1) return;

    UpdateCommunityInvitations();

    const channel = listenForCommunityInvitationChanges(
      activeCommunity.id,
      (payload) => {
        UpdateCommunityInvitations();
      }
    );

    return () => supabase.removeChannel(channel);
  }, [activeCommunity]);

  return [communityInvitations, setCommunityInvitations];
}

function listenForCommunityInvitationChanges(communityId, onChange) {
  const channel = supabase
    .channel(`communityInvitations-${communityId}`)
    .on(
      "postgres_changes",
      {
        event: "*", // can be 'INSERT', 'UPDATE', 'DELETE'
        schema: "public",
        table: "invitations",
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
