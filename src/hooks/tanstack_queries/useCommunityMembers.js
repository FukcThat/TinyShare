import { useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { InvalidCommunityId } from '../../lib/InvalidCommunityId';

const fetchCommunityMembers = async (communityId) => {
  const { data, error } = await supabase
    .from('memberships')
    .select('id, role, profiles(id, email, created_at, name )')
    .eq('community_id', communityId);
  if (error) throw new Error('Issue fetching community members!');
  return data;
};

export default function useCommunityMembers(activeCommunity) {
  const queryClient = useQueryClient();
  const activeCommunityId = useMemo(
    () => activeCommunity?.id,
    [activeCommunity],
  );

  const query = useQuery({
    queryKey: ['CommunityMembers', activeCommunityId],
    queryFn: () => fetchCommunityMembers(activeCommunityId),
    enabled: !!activeCommunityId && activeCommunityId != InvalidCommunityId,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!activeCommunityId || activeCommunityId === InvalidCommunityId) return;

    const channel = listenForCommunityMembershipChanges(
      activeCommunityId,
      () => {
        queryClient.invalidateQueries(['CommunityMembers', activeCommunityId]);
        queryClient.invalidateQueries(['CommunityItems', activeCommunityId]);
      },
    );

    return () => supabase.removeChannel(channel);
  }, [activeCommunityId, queryClient]);

  return query;
}

function listenForCommunityMembershipChanges(communityId, onChange) {
  const channel = supabase
    .channel(`communityMemberships-${communityId}`)
    .on(
      'postgres_changes',
      {
        event: '*', // can be 'INSERT', 'UPDATE', 'DELETE'
        schema: 'public',
        table: 'memberships',
        filter: `community_id=eq.${communityId}`,
      },
      (payload) => {
        console.log('🔄 Community Membership change:', payload);
        onChange(payload);
      },
    )
    .subscribe((stat) => console.log(stat));

  return channel;
}
