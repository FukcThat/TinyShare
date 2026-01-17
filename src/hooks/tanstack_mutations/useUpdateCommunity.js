import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from '../../context/session_context/useSession';
import { supabase } from '../../lib/supabaseClient';

const updateCommunity = async ({
  communityToEditId,
  editNameInput,
  editDescInput,
}) => {
  const { data, error } = await supabase
    .from('communities')
    .update({ name: editNameInput, description: editDescInput })
    .eq('id', communityToEditId)
    .select()
    .single();

  if (error) throw new Error('Issue updating community!');

  return data;
};

export default function useUpdateCommunity() {
  const queryClient = useQueryClient();
  const { session } = useSession();

  return useMutation({
    mutationFn: updateCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries(['UserCommunities', session.user.id]);
    },
  });
}
