import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useItemContext } from "../../context/item_context/useItemContext";
import { useGlobal } from "../../context/useGlobal";
import { supabase } from "../../lib/supabaseClient";


const ApproveItemReservation = async ({ reservationId }) => {
  const { data, error } = await supabase
    .from("item_reservations")
    .update({ status: "booking" })
    .eq("id", reservationId)
    .select()
    .single();

  if (error) throw new Error("Issue with approving item reservation!");

  return data;
};

export default function useApproveItemReservation() {
  const queryClient = useQueryClient();
  const { itemToRequest } = useItemContext();
  const { activeCommunity } = useGlobal();

  const activeId = activeCommunity?.id;
  const itemId = itemToRequest?.id;

  return useMutation({
    mutationFn: ApproveItemReservation,
    onSuccess: (data) => {
      queryClient.setQueryData(["CommunityItems", activeId], (old) =>
        old.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              item_reservations: item.item_reservations.map((res) =>
                res.id === data.id ? data : res
              ),
            };
          }
          return item;
        })
      );
    },
  });
}
