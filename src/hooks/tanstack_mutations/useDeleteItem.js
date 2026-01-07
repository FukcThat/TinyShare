import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';
import { useGlobal } from '../../context/useGlobal';
import { useMemo } from 'react';
import DeleteImageByUrl from '../../lib/DeleteImageByUrl';
import { useSession } from '../../context/session_context/useSession';

const deleteItem = async ({ item_id, image_url }) => {
  if (image_url) {
    await DeleteImageByUrl(image_url, supabase);
  }
  const { error } = await supabase.from('items').delete().eq('id', item_id);
  if (error) throw new Error('Issue deleting item');
  return { item_id };
};

export default function useDeleteItem() {
  const queryClient = useQueryClient();

  const { activeCommunity } = useGlobal();
  const { session } = useSession();

  const userId = session?.user.id;
  const activeId = useMemo(() => activeCommunity?.id, [activeCommunity]);

  return useMutation({
    mutationFn: deleteItem,
    onSuccess: (data) => {
      queryClient.setQueryData(['CommunityItems', activeId], (old) =>
        old ? old.filter((c) => c.id != data.item_id) : null
      );
      queryClient.setQueryData(['UserItems', userId], (old) =>
        old.filter((c) => c.id != data.item_id)
      );
    },
  });
}
