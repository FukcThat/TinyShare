import { useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useGlobal } from '../../context/useGlobal';
import { InvalidCommunityId } from '../../lib/InvalidCommunityId';

const fetchCommunityInvitations = async (activeId) => {
  const { data, error } = await supabase
    .from('invitations')
    .select(
      `*,
      profiles!invitations_invitee_id_fkey(*)
      `
    )
    .eq('community_id', activeId);

  if (error) throw new Error('Issue fetching community invitations!');

  return data;
};

export default function useCommunityInvitations() {
  const queryClient = useQueryClient();
  const { activeCommunity } = useGlobal();

  const activeId = useMemo(() => activeCommunity?.id, [activeCommunity]);
  const query = useQuery({
    queryKey: ['CommunityInvitations', activeId],
    queryFn: () => fetchCommunityInvitations(activeId),
    enabled: !!activeId && activeId != InvalidCommunityId,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!activeId || activeId === InvalidCommunityId) return;

    const channel = listenForCommunityInvitationChanges(activeId, () => {
      queryClient.invalidateQueries(['CommunityInvitations', activeId]);
    });

    return () => supabase.removeChannel(channel);
  }, [activeId, queryClient]);

  return query;
}

function listenForCommunityInvitationChanges(communityId, onChange) {
  const channel = supabase
    .channel(`communityInvitations-${communityId}`)
    .on(
      'postgres_changes',
      {
        event: '*', // can be 'INSERT', 'UPDATE', 'DELETE'
        schema: 'public',
        table: 'invitations',
        filter: `community_id=eq.${communityId}`,
      },
      (payload) => {
        console.log('🔄 Community Invitations change:', payload);
        onChange(payload);
      }
    )
    .subscribe();

  return channel;
}
