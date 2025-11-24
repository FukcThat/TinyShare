import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import inFilter from "../lib/inFilter";
import useCommunityMembers from "./tanstack_queries/useCommunityMembers";

export default function useCommunityItems(activeCommunity) {
  const [communityItems, setCommunityItems] = useState(null);
  const { data: communityMembers } = useCommunityMembers(activeCommunity);

  const UpdateCommunityItems = () => {
    supabase
      .from("items")
      .select("id, name, is_available, owner(*), item_reservations(*)")
      .in(
        "owner",
        communityMembers.map((member) => member.profiles.id)
      )
      .then((res) => {
        setCommunityItems(res.data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (!communityMembers || communityMembers.length === 0) return;
    UpdateCommunityItems();
  }, [communityMembers]);

  useEffect(() => {
    if (!communityMembers || communityMembers.length === 0) return;

    const channel = listenForCommunityItemChanges(
      activeCommunity.id,
      communityMembers.map((member) => member.profiles.id),
      (payload) => {
        UpdateCommunityItems();
        console.log("refetch");
      }
    );

    return () => supabase.removeChannel(channel);
  }, [communityMembers]);

  return [communityItems, setCommunityItems];
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
    .subscribe();

  return channel;
}
