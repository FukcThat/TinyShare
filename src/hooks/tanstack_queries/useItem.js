import { useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const fetchItem = async (itemId) => {
  const { data, error } = await supabase
    .from('items')
    .select(
      'id, name, description, is_available, owner(*), item_reservations(*, user_id(*)), image_url',
    )
    .eq('id', itemId);

  if (error) throw new Error('Issue fetching item.');

  return data;
};

export default function useItem(itemId) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['Item', itemId],
    queryFn: () => fetchItem(itemId),
    enabled: itemId != null,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!itemId) return;

    const channel = listenForItemChanges(itemId, () => {
      queryClient.invalidateQueries(['Item', itemId]);
    });

    return () => supabase.removeChannel(channel);
  }, [itemId, queryClient]);

  return query;
}

function listenForItemChanges(itemId, onChange) {
  const channel = supabase
    .channel(`item-${itemId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'items',
        filter: `id=eq.${itemId}`,
      },
      (payload) => {
        console.log('🔄Current Item change:', payload);
        onChange(payload);
      },
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'item_reservations',
        filter: `item_id=eq.${itemId}`,
      },
      (payload) => {
        console.log('🔄 Current Item Reservations change:', payload);
        onChange(payload);
      },
    )
    .subscribe((stat) => console.log(stat));

  return channel;
}
