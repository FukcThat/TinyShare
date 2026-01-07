import { useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from '../../context/session_context/useSession';

const fetchUserItem = async (userId) => {
  const { data, error } = await supabase
    .from('items')
    .select(
      'id, name, description, is_available, owner(*), item_reservations(*, user_id(*)), image_url'
    )
    .eq('owner', userId);

  if (error) throw new Error('Issue fetching user items.');

  return data;
};

export default function useUserItems() {
  const queryClient = useQueryClient();
  const { session } = useSession();
  const userId = useMemo(() => session?.user.id, [session]);

  const query = useQuery({
    queryKey: ['UserItems', userId],
    queryFn: () => fetchUserItem(userId),
    enabled: !!userId,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!userId) return;

    const channel = listenForCommunityItemChanges(userId, () => {
      queryClient.invalidateQueries(['UserItems', userId]);
    });

    return () => supabase.removeChannel(channel);
  }, [queryClient, userId]);

  return query;
}

function listenForCommunityItemChanges(userId, onChange) {
  const channel = supabase
    .channel(`items-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'items',
        filter: `owner=eq.${userId}`,
      },
      (payload) => {
        console.log('🔄 User Items change:', payload);
        onChange(payload);
      }
    )
    .subscribe((stat) => console.log(stat));

  return channel;
}
