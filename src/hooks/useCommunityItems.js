import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import inFilter from "../lib/inFilter";

export default function useCommunityItems(activeCommunity, communityMembers) {
  const [communityItems, setCommunityItems] = useState(null);

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
    if (!communityMembers) return;
    UpdateCommunityItems();
  }, [communityMembers]);

  useEffect(() => {
    if (!communityItems) return;

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
