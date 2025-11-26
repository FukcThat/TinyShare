import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useGlobal } from "../../context/useGlobal";
import { supabase } from "../../lib/supabaseClient";
import { useMemo } from "react";

const createItem = async ({ owner, name, is_available }) => {
  const { data, error } = await supabase
    .from("items")
    .insert([
      {
        owner,
        name,
        is_available,
      },
    ])
    .select("id, name, is_available, owner(*), item_reservations(*)")
    .single();

  if (error) throw new Error(error.message);

  return data;
};

export default function useCreateItem() {
  const queryClient = useQueryClient();
  const { activeCommunity } = useGlobal();

  const activeId = useMemo(() => activeCommunity?.id, [activeCommunity]);

  return useMutation({
    mutationFn: createItem,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["CommunityItems", activeId], (old) => [
        ...old,
        data,
      ]);
    },
  });
}
