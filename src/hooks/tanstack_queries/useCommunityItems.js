import { useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabaseClient';
import inFilter from '../../lib/inFilter';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const fetchCommunityItems = async (communityId) => {
  const { data: members, error: membersErr } = await supabase
    .from('memberships')
    .select('user_id')
    .eq('community_id', communityId);

  if (membersErr)
    throw new Error('Issue fetching members for community items.!');

  const { data, error } = await supabase
    .from('items')
    .select(
      'id, name, description, is_available, owner(*), item_reservations(*, user_id(*)), image_url'
    )
    .in(
      'owner',
      members.map((m) => m.user_id)
    );
  if (error) throw new Error('Issue fetching community items.');

  return data;
};

export default function useCommunityItems(activeCommunity, communityMembers) {
  const queryClient = useQueryClient();
  const activeId = activeCommunity?.id;
  const communityMemberIds = useMemo(() => {
    return communityMembers ? communityMembers.map((m) => m.profiles.id) : [];
  }, [communityMembers]);

  const query = useQuery({
    queryKey: ['CommunityItems', activeId],
    queryFn: () => fetchCommunityItems(activeId),
    enabled: !!activeId && activeId != -1,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!activeId || communityMemberIds.length === 0) return;

    const channel = listenForCommunityItemChanges(
      activeId,
      communityMemberIds,
      () => {
        queryClient.invalidateQueries(['CommunityItems', activeId]);
      }
    );

    return () => supabase.removeChannel(channel);
  }, [communityMemberIds, activeId, queryClient]);

  return query;
}

function listenForCommunityItemChanges(
  communityId,
  communityMembers,
  onChange
) {
  const channel = supabase
    .channel(`items-${communityId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'items',
        filter: inFilter('owner', communityMembers),
      },
      (payload) => {
        console.log('🔄 Community Items change:', payload);
        onChange(payload);
      }
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'item_reservations',
        filter: inFilter('user_id', communityMembers),
      },
      (payload) => {
        console.log('🔄 Community Item Reservations change:', payload);
        onChange(payload);
      }
    )
    .subscribe((stat) => console.log(stat));

  return channel;
}
