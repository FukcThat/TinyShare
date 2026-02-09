import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';
import { useSession } from '../../context/session_context/useSession';

const DismissNotification = async ({ notification_id }) => {
  console.log(notification_id);
  const { data, error } = await supabase
    .from('notifications')
    .update({ dismissed: true })
    .eq('id', notification_id)
    .select('*')
    .single();

  if (error) throw new Error('Issue dismissing user notification!');

  return data;
};

export default function useDimissNotification() {
  const queryClient = useQueryClient();
  const { session } = useSession();

  const userId = session?.user.id;

  return useMutation({
    mutationFn: DismissNotification,
    onSuccess: (data) => {
      queryClient.setQueryData(['UserNotifications', userId], (old) => {
        if (!old) return old;
        const newOld = old.map((item) => {
          if (item.id === data.id) {
            return {
              ...item,
              dismissed: true,
            };
          }
          return item;
        });
        return newOld;
      });
    },
  });
}
