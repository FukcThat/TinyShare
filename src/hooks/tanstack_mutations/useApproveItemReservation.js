import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useGlobal } from '../../context/useGlobal';
import { supabase } from '../../lib/supabaseClient';
import { useSession } from '../../context/session_context/useSession';
import { NotificationType } from '../../lib/NotificationType';

const ApproveItemReservation = async ({ reservationId }) => {
  const { data, error } = await supabase
    .from('item_reservations')
    .update({ status: 'booking' })
    .eq('id', reservationId)
    .select('*, user:user_id(*), item:item_id(*) ')
    .single();

  if (error) throw new Error('Issue with approving item reservation!');

  const { error: notificationError } = await supabase
    .from('notifications')
    .insert({
      recipient: data.user_id,
      type: NotificationType.borrow_approved,
      data: JSON.stringify(data),
    });

  if (notificationError)
    throw new Error('Issue creating notification for booking approval');

  return data;
};

export default function useApproveItemReservation({ itemId }) {
  const queryClient = useQueryClient();
  const { activeCommunity } = useGlobal();
  const { session } = useSession();

  const userId = session?.user.id;
  const activeId = activeCommunity?.id;

  return useMutation({
    mutationFn: ApproveItemReservation,
    onSuccess: (data) => {
      queryClient.setQueryData(['CommunityItems', activeId], (old) =>
        !old
          ? old
          : old.map((item) => {
              if (item.id === itemId) {
                return {
                  ...item,
                  item_reservations: item.item_reservations.map((res) =>
                    res.id === data.id ? data : res,
                  ),
                };
              }
              return item;
            }),
      );
      queryClient.setQueryData(['UserItems', userId], (old) => {
        if (!old) return old;
        const newOld = old.map((item) => {
          if (item.id === data.item_id) {
            return {
              ...item,
              item_reservations: item.item_reservations.map((res) =>
                res.id === data.id ? data : res,
              ),
            };
          }
          return item;
        });
        return newOld;
      });
      queryClient.setQueryData(['UserReservations', userId], (old) => {
        if (!old) return old;
        const newOld = old.map((res) => {
          if (res.id === data.id) {
            return {
              ...res,
              status: 'booking',
            };
          }
          return res;
        });
        return newOld;
      });
    },
  });
}
