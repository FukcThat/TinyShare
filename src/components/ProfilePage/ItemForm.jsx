import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Checkbox from '../ui/Checkbox';
import { useItemContext } from '../../context/item_context/useItemContext';
import useCreateItem from '../../hooks/tanstack_mutations/useCreateItem';
import { useSession } from '../../context/session_context/useSession';

export default function ItemForm({ setIsOpen }) {
  const { session } = useSession();
  const { itemToEdit } = useItemContext();
  const [formData, setFormData] = useState({
    name: '',
    isAvailable: true,
  });
  const CreateItem = useCreateItem();

  const HandleCreateItem = async (e) => {
    e.preventDefault();
    if (formData.name == '') return;

    CreateItem.mutate(
      {
        owner: session.user.id,
        is_available: formData.isAvailable,
        name: formData.name,
      },
      {
        onSuccess: () => setFormData({ ...formData, name: '' }),
      }
    );
  };

  return (
    <form
      onSubmit={HandleCreateItem}
      className="flex flex-col w-full items-center gap-4 bg-primary p-2 rounded-xl"
    >
      <Input
        disabled={CreateItem.isPending}
        id="name"
        outerStyles="w-full flex flex-col md:grid md:grid-cols-2"
        placeholder=""
        value={formData.name}
        withLabel
        labelText="Item Name"
        labelStyles="m-0 md:ml-4"
        inputStyles="border"
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <Checkbox
        disabled={CreateItem.isPending}
        id="isAvailableCheckbox"
        labelText="Available"
        styles="flex justify-center gap-6 md:grid md:grid-cols-2 w-full px-4 text-lg md:gap-0 accent-accent"
        onChange={() =>
          setFormData({ ...formData, isAvailable: !formData.isAvailable })
        }
        value={formData.isAvailable}
      />
      <div className="flex w-full justify-around">
        <Button
          disabled={CreateItem.isPending}
          text={itemToEdit === null ? 'Submit' : 'Update'}
          type="submit"
          styles="bg-accent/80 hover:bg-accent"
        />
        <Button
          disabled={CreateItem.isPending}
          type="button"
          text="Cancel"
          styles="bg-warning/80 hover:bg-warning"
          onClick={() => setIsOpen(false)}
        />
      </div>
    </form>
  );
}
