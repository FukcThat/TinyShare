import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useGlobal } from '../../context/useGlobal';
import { supabase } from '../../lib/supabaseClient';
import { useMemo } from 'react';
import { useSession } from '../../context/session_context/useSession';

const createItem = async ({ owner, name, is_available, description, file }) => {
  let image_url = null;

  if (file) {
    const filePath = `${owner}/${crypto.randomUUID()}`;

    const { error: uploadError } = await supabase.storage
      .from('item_images')
      .upload(filePath, file);

    if (uploadError) {
      console.log('issue with upload');
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('item_images')
      .getPublicUrl(filePath);

    image_url = data.publicUrl;
  }

  // get file url for this next part

  const { data, error } = await supabase
    .from('items')
    .insert([
      {
        owner,
        name,
        is_available,
        description,
        image_url,
      },
    ])
    .select(
      'id, name, description, is_available, owner(*), item_reservations(*), image_url'
    )
    .single();

  if (error) throw new Error(error.message);

  return data;
};

export default function useCreateItem() {
  const queryClient = useQueryClient();
  const { activeCommunity } = useGlobal();
  const { session } = useSession();

  const userId = useMemo(() => session?.user.id, [session]);
  const activeId = useMemo(() => activeCommunity?.id, [activeCommunity]);

  return useMutation({
    mutationFn: createItem,
    onSuccess: (data) => {
      queryClient.setQueryData(['CommunityItems', activeId], (old) =>
        old ? [...old, data] : null
      );

      queryClient.setQueryData(['UserItems', userId], (old) => [...old, data]);
    },
  });
}
