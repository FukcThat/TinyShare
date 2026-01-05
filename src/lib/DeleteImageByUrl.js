export default async function DeleteImageByUrl(imageUrl, supabase) {
  const filePath = imageUrl.split('/storage/v1/object/public/item_images/')[1];
  if (filePath) {
    const { error: fileDeleteError } = await supabase.storage
      .from('item_images')
      .remove([filePath]);

    if (fileDeleteError) throw fileDeleteError;
  } else {
    throw new Error('NO FILE PATH FOR OLD FILE FOUND');
  }
}
