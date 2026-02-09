import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';
import { useGlobal } from '../../context/useGlobal';
import { useSession } from '../../context/session_context/useSession';
import { NotificationType } from '../../lib/NotificationType';

const SubmitItemReservation = async ({
  user_id,
  item_id,
  start,
  end,
  status,
}) => {
  const { data, error } = await supabase
    .from('item_reservations')
    .insert([
      {
        user_id,
        item_id,
        start,
        end,
        status,
      },
    ])
    .select('*, user:user_id(*), item:item_id(*, owner(*)) ')
    .single();

  if (error) throw new Error('Issue submitting item reservation!');

  if (data.user.id != data.item.owner.id) {
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        recipient: data.item.owner.id,
        type: NotificationType.default,
        body: `${data.user.name} has requested to borrow your ${data.item.name}`,
        link: `/items/${data.item.id}`,
      });

    if (notificationError)
      throw new Error('Issue creating notification for booking approval');
  }
  console.log(data);

  return data;
};

export default function useSubmitItemReservation() {
  const queryClient = useQueryClient();
  const { activeCommunity } = useGlobal();
  const activeId = activeCommunity?.id;
  const { session } = useSession();

  const userId = session?.user.id;

  return useMutation({
    mutationFn: SubmitItemReservation,
    onSuccess: (data) => {
      queryClient.setQueryData(['CommunityItems', activeId], (old) => {
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
      queryClient.setQueryData(['UserItems', userId], (old) => {
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
