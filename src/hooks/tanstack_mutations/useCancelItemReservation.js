import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useGlobal } from '../../context/useGlobal';
import { supabase } from '../../lib/supabaseClient';
import { useSession } from '../../context/session_context/useSession';

const CancelItemReservation = async ({ reservationId }) => {
  const { error } = await supabase
    .from('item_reservations')
    .delete()
    .eq('id', reservationId);

  if (error) throw new Error('Issue with cancelling item reservation!');

  return { ok: true };
};

export default function useCancelItemReservation(itemId) {
  const queryClient = useQueryClient();
  const { activeCommunity } = useGlobal();
  const { session } = useSession();

  const activeId = activeCommunity?.id;
  const userId = session?.user.id;

  return useMutation({
    mutationFn: CancelItemReservation,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['CommunityItems', activeId], (old) =>
        !old
          ? old
          : old.map((item) => {
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
      queryClient.setQueryData(['UserItems', userId], (old) => {
        if (!old) return old;
        const newOld = old.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              item_reservations: item.item_reservations.filter(
                (res) => res.id != variables.reservationId
              ),
            };
          }
          return item;
        });
        console.log(newOld, variables);

        return newOld;
      });
      queryClient.setQueryData(['UserReservations', userId], (old) => {
        if (!old) return old;
        const newOld = old.filter((res) => {
          res.id != variables.reservationId;
        });
        return newOld;
      });
    },
  });
}
