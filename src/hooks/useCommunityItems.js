import { useEffect, useMemo } from "react";
import { supabase } from "../lib/supabaseClient";
import inFilter from "../lib/inFilter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useGlobal } from "../context/useGlobal";
import { useItemContext } from "../context/item_context/useItemContext";

const fetchCommunityItems = async (
  communityMemberIds,
  itemToRequest,
  setItemToRequest
) => {
  const { data, error } = await supabase
    .from("items")
    .select("id, name, is_available, owner(*), item_reservations(*)")
    .in("owner", communityMemberIds);

  if (error) throw new Error("Issue fetching community items.");

  if (itemToRequest) {
    for (let item of data) {
      if (item.id === itemToRequest.id) {
        setItemToRequest(item);
      }
    }
  }

  return data;
};

export default function useCommunityItems() {
  const queryClient = useQueryClient();
  const { activeCommunity, communityMembers } = useGlobal();
  const { itemToRequest, setItemToRequest } = useItemContext();
  const activeId = activeCommunity?.id;
  const communityMemberIds = useMemo(() => {
    return communityMembers ? communityMembers.map((m) => m.profiles.id) : [];
  }, [communityMembers]);

  const query = useQuery({
    queryKey: ["CommunityItems", activeId],
    queryFn: () =>
      fetchCommunityItems(communityMemberIds, itemToRequest, setItemToRequest),
    enabled: !!activeId && communityMembers?.length > 0,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!activeId || communityMemberIds.length === 0) return;
    const channel = listenForCommunityItemChanges(
      activeId,
      communityMemberIds,
      (payload) => {
        queryClient.invalidateQueries(["CommunityItems", activeId]);
      }
    );
    return () => supabase.removeChannel(channel);
  }, [communityMemberIds, activeId]);

  return query;
}

function listenForCommunityItemChanges(
  communityId,
  communityMembers,
  onChange
) {
  const channel = supabase
    .channel(`items-${communityId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "items",
        filter: inFilter("owner", communityMembers),
      },
      (payload) => {
        console.log("🔄 Community Items change:", payload);
        onChange(payload);
      }
    )
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "item_reservations",
        filter: inFilter("user_id", communityMembers),
      },
      (payload) => {
        console.log("🔄 Community Item Reservations change:", payload);
        onChange(payload);
      }
    )
    .subscribe((stat) => console.log(stat));

  return channel;
}
