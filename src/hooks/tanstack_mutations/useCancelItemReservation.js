import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useItemContext } from "../../context/item_context/useItemContext";
import { useGlobal } from "../../context/useGlobal";
import { supabase } from "../../lib/supabaseClient";

const CancelItemReservation = async ({ reservationId }) => {
  const { error } = await supabase
    .from("item_reservations")
    .delete()
    .eq("id", reservationId);

  if (error) throw new Error("Issue with cancelling item reservation!");

  return { ok: true };
};

export default function useCancelItemReservation() {
  const queryClient = useQueryClient();
  const { itemToRequest } = useItemContext();
  const { activeCommunity } = useGlobal();

  const activeId = activeCommunity?.id;
  const itemId = itemToRequest?.id;

  return useMutation({
    mutationFn: CancelItemReservation,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["CommunityItems", activeId], (old) =>
        old.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              item_reservations: item.item_reservations.filter(
                (res) => res.id != variables.reservationId
              ),
            };
          }
          return item;
        })
      );
    },
  });
}
