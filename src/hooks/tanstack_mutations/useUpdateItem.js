import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabaseClient";
import { useGlobal } from "../../context/useGlobal";
import { useMemo } from "react";

const updateItem = async ({ item_id, name, is_available }) => {
  const { data, error } = await supabase
    .from("items")
    .update({ name, is_available })
    .eq("id", item_id)
    .select("id, name, is_available, owner(*), item_reservations(*)")
    .single();

  if (error) throw new Error("Issue updating item");

  return data;
};

export default function useUpdateItem() {
  const queryClient = useQueryClient();
  const { activeCommunity } = useGlobal();
  const activeId = activeCommunity?.id;

  return useMutation({
    mutationFn: updateItem,
    onSuccess: (data) => {
      queryClient.setQueryData(["CommunityItems", activeId], (old) =>
        old.map((item) => {
          if (item.id === data.id) return data;
          return item;
        })
      );
    },
  });
}
