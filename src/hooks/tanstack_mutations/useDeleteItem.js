import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabaseClient";
import { useGlobal } from "../../context/useGlobal";
import { useMemo } from "react";

const deleteItem = async ({ item_id }) => {
  const { error } = await supabase.from("items").delete().eq("id", item_id);
  if (error) throw new Error("Issue deleting item");
  return { item_id };
};

export default function useDeleteItem() {
  const queryClient = useQueryClient();

  const { activeCommunity } = useGlobal();

  const activeId = useMemo(() => activeCommunity?.id, [activeCommunity]);

  return useMutation({
    mutationFn: deleteItem,
    onSuccess: (data) => {
      queryClient.setQueryData(["CommunityItems", activeId], (old) =>
        old.filter((c) => c.id != data.item_id)
      );
    },
  });
}
