import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useGlobal } from '../../context/useGlobal';
import { supabase } from '../../lib/supabaseClient';
import { useSession } from '../../context/session_context/useSession';
import { NotificationType } from '../../lib/NotificationType';

const CancelItemReservation = async ({ reservationId }) => {
  const { data, error } = await supabase
    .from('item_reservations')
    .delete()
    .eq('id', reservationId)
    .select('*, user:user_id(*), item:item_id(*,owner(*)) ')
    .single();

  console.log(data);

  if (error) throw new Error('Issue with cancelling item reservation!');

  if (data.user.id != data.item.id) {
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        recipient: data.user.id,
        type: NotificationType.error,
        body: `${data.item.owner.name} has ${data.status === 'request' ? 'denied your request' : 'cancelled your booking'} to borrow their ${data.item.name} on the ${new Date(data.start).toLocaleDateString()} at ${new Date(data.start).toLocaleTimeString()}`,
        link: `/items/${data.item.id}`,
      });

    if (notificationError)
      throw new Error('Issue creating notification for booking approval');
  }

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
                    (res) => res.id != variables.reservationId,
                  ),
                };
              }
              return item;
            }),
      );
      queryClient.setQueryData(['UserItems', userId], (old) => {
        if (!old) return old;
        const newOld = old.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              item_reservations: item.item_reservations.filter(
                (res) => res.id != variables.reservationId,
              ),
            };
          }
          return item;
        });

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
