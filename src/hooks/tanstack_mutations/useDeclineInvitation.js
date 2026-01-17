import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '../../context/session_context/useSession';
import { useMemo } from 'react';
import { supabase } from '../../lib/supabaseClient';

const declineInvitation = async ({ inviteId }) => {
  const { data, error } = await supabase
    .from('invitations')
    .delete()
    .eq('id', inviteId)
    .select()
    .single();

  if (!data || error) throw new Error('Issue Declining the invitation ');

  return data;
};

export default function useDeclineInvitation() {
  const queryClient = useQueryClient();
  const { session } = useSession();

  const userId = useMemo(() => session?.user?.id, [session]);

  return useMutation({
    mutationFn: declineInvitation,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['UserInvitations', userId], (old) =>
        old.filter((invite) => invite.id !== variables.inviteId)
      );
      queryClient.setQueryData(['CommunityInvitations', data.id], (old) =>
        old.filter((invite) => invite.id != variables.inviteId)
      );
    },
  });
}
