import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';

const updateUserProfile = async ({ userId, name }) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ name })
    .eq('id', userId)
    .select('name')
    .single();
  if (error) throw new Error('Issue updating user profile!');
  return data;
};

export default function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data, variables) => {
      // variables = {userId, name}
      queryClient.setQueryData(['UserProfile', variables.userId], (old) => ({
        ...old,
        name: data.name,
      }));
    },
  });
}
