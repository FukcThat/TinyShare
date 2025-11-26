import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabaseClient";
import { useGlobal } from "../../context/useGlobal";

const SubmitItemReservation = async ({
  user_id,
  item_id,
  start,
  end,
  status,
}) => {
  const { data, error } = await supabase
    .from("item_reservations")
    .insert([
      {
        user_id,
        item_id,
        start,
        end,
        status,
      },
    ])
    .select()
    .single();

  if (error) throw new Error("Issue submitting item reservation!");

  return data;
};

export default function useSubmitItemReservation() {
  const queryClient = useQueryClient();
  const { activeCommunity } = useGlobal();
  const activeId = activeCommunity?.id;

  return useMutation({
    mutationFn: SubmitItemReservation,
    onSuccess: (data) => {
      queryClient.setQueryData(["CommunityItems", activeId], (old) => {
        if (!old) return old;
        const newOld = old.map((item) => {
          if (item.id === data.item_id) {
            return {
              ...item,
              item_reservations: [...item.item_reservations, data],
            };
          }
          return item;
        });
        return newOld;
      });
    },
  });
}
