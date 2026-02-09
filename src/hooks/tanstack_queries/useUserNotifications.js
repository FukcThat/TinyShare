import { useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from '../../context/session_context/useSession';

const fetchUserNotifications = async (userId) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('recipient', userId)
    .eq('dismissed', false);

  if (error) throw new Error('Issue fetching user notifications!');

  return data;
};

export default function useUserNotifications() {
  const queryClient = useQueryClient();
  const { session } = useSession();

  const userId = useMemo(() => session?.user?.id, [session]);

  const query = useQuery({
    queryKey: ['UserNotifications', userId],
    queryFn: () => fetchUserNotifications(userId),
    enabled: !!userId,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!userId) return;
    const channel = listenForUserNotificationChanges(userId, () =>
      queryClient.invalidateQueries(['UserNotifications', userId]),
    );

    return () => supabase.removeChannel(channel);
  }, [userId, queryClient]);

  return query;
}

function listenForUserNotificationChanges(userId, onChange) {
  const channel = supabase
    .channel(`userNotifications-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*', // can be 'INSERT', 'UPDATE', 'DELETE'
        schema: 'public',
        table: 'notifications',
        filter: `recipient=eq.${userId}`,
      },
      (payload) => {
        console.log('🔄 User Notification change:', payload);
        onChange(payload);
      },
    )
    .subscribe();

  return channel;
}
