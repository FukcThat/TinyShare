import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';
import { useSession } from '../../context/session_context/useSession';
import { useNavigate } from 'react-router';

const kickMember = async ({ memberId, activeCommunity }) => {
  const { data, error } = await supabase
    .from('memberships')
    .delete()
    .eq('user_id', memberId)
    .eq('community_id', activeCommunity.id)
    .select();

  if (error || data.length === 0) throw new Error('Issue Deleting Membership!');
  return data;
};

export default function useKickMember() {
  const queryClient = useQueryClient();
  const { session } = useSession();
  const nav = useNavigate();

  return useMutation({
    mutationFn: kickMember,
    onSuccess: (data, variables) => {
      if (variables.memberId === session.user.id) {
        queryClient.invalidateQueries(['UserCommunities', variables.user_id]);
        nav('/');
      }
      queryClient.invalidateQueries([
        'CommunityMembers',
        variables.activeCommunity.id,
      ]); // can be optimized by finding this memberId in the communityMembers old data and removing it, would save a server call
    },
  });
}
