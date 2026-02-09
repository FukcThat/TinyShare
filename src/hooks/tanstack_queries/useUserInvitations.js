import { useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from '../../context/session_context/useSession';

const fetchUserInvitation = async (userId) => {
  const { data, error } = await supabase
    .from('invitations')
    .select('*, communities (*), inviter_id(*)')
    .eq('invitee_id', userId);

  if (error) throw new Error('Issue fetching user invitations!');

  return data;
};

export default function useUserInvitations() {
  const queryClient = useQueryClient();
  const { session } = useSession();

  const userId = useMemo(() => session?.user?.id, [session]);

  const query = useQuery({
    queryKey: ['UserInvitations', userId],
    queryFn: () => fetchUserInvitation(userId),
    enabled: !!userId,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!userId) return;
    const channel = listenForUserInviteChanges(userId, () =>
      queryClient.invalidateQueries(['UserInvitations', userId]),
    );

    return () => supabase.removeChannel(channel);
  }, [userId, queryClient]);

  return query;
}

function listenForUserInviteChanges(userId, onChange) {
  const channel = supabase
    .channel(`userInvitations-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*', // can be 'INSERT', 'UPDATE', 'DELETE'
        schema: 'public',
        table: 'invitations',
        filter: `invitee_id=eq.${userId}`,
      },
      (payload) => {
        console.log('🔄 User Invitations change:', payload);
        onChange(payload);
      },
    )
    .subscribe();

  return channel;
}
