import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabaseClient';
import { useGlobal } from '../../context/useGlobal';
import DeleteImageByUrl from '../../lib/DeleteImageByUrl';

const updateItem = async ({
  item_id,
  name,
  is_available,
  description,
  newFile,
  oldImageUrl,
  owner,
}) => {
  let image_url = oldImageUrl;
  if (oldImageUrl) {
    await DeleteImageByUrl(oldImageUrl, supabase);
  }

  if (newFile) {
    const newFilePath = `${owner}/${crypto.randomUUID()}`;

    const { error: uploadError } = await supabase.storage
      .from('item_images')
      .upload(newFilePath, newFile);

    if (uploadError) throw uploadError;

    image_url = supabase.storage.from('item_images').getPublicUrl(newFilePath)
      .data.publicUrl;
  }

  const { data, error } = await supabase
    .from('items')
    .update({ name, is_available, description, image_url })
    .eq('id', item_id)
    .select(
      'id, name,description, is_available, owner(*), item_reservations(*), image_url'
    )
    .single();

  if (error) throw new Error('Issue updating item');

  return data;
};

export default function useUpdateItem() {
  const queryClient = useQueryClient();
  const { activeCommunity } = useGlobal();
  const activeId = activeCommunity?.id;

  return useMutation({
    mutationFn: updateItem,
    onSuccess: (data) => {
      queryClient.setQueryData(['CommunityItems', activeId], (old) =>
        old.map((item) => {
          if (item.id === data.id) return data;
          return item;
        })
      );
    },
  });
}
