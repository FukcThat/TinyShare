import { useEffect, useMemo } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const fetchCommunityMembers = async (communityId) => {
  const { data, error } = await supabase
    .from("memberships")
    .select("id, role, profiles(id, email)")
    .eq("community_id", communityId);
  if (error) throw new Error("Issue fetching community members!");
  return data;
};

export default function useCommunityMembers(activeCommunity) {
  const queryClient = useQueryClient();

  const activeCommunityId = useMemo(
    () => activeCommunity?.id,
    [activeCommunity]
  );

  const query = useQuery({
    queryKey: ["CommunityMembers", activeCommunityId],
    queryFn: () => fetchCommunityMembers(activeCommunityId),
    enabled: !!activeCommunityId && activeCommunityId != -1,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!activeCommunityId || activeCommunityId === -1) return;

    const channel = listenForCommunityMembershipChanges(
      activeCommunityId,
      (payload) => {
        queryClient.invalidateQueries("CommunityMembers", activeCommunityId);
      }
    );

    return () => supabase.removeChannel(channel);
  }, [activeCommunityId]);

  return query;
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
        console.log("🔄 Community Membership change:", payload);
        onChange(payload);
      }
    )
    .subscribe();

  return channel;
}
