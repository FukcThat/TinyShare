import { useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from '../../context/session_context/useSession';

const fetchUserReservations = async (userId) => {
  const { data, error } = await supabase
    .from('item_reservations')
    .select('*, user:user_id(*), item:item_id(*) ')
    .eq('user_id', userId);

  if (error) throw new Error('Issue fetching user invitations!');

  return data;
};

export default function useUserReservations() {
  const queryClient = useQueryClient();
  const { session } = useSession();

  const userId = useMemo(() => session?.user?.id, [session]);

  const query = useQuery({
    queryKey: ['UserReservations', userId],
    queryFn: () => fetchUserReservations(userId),
    enabled: !!userId,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!userId) return;
    const channel = listenForUserReservationChanges(userId, () =>
      queryClient.invalidateQueries(['UserReservations', userId])
    );

    return () => supabase.removeChannel(channel);
  }, [userId, queryClient]);

  return query;
}

function listenForUserReservationChanges(userId, onChange) {
  const channel = supabase
    .channel(`userReservations-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*', // can be 'INSERT', 'UPDATE', 'DELETE'
        schema: 'public',
        table: 'item_reservations',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        console.log('🔄 User Reservations change:', payload);
        onChange(payload);
      }
    )
    .subscribe();

  return channel;
}
