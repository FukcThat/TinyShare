import { useEffect, useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Checkbox from "../ui/Checkbox";
import { useItemContext } from "../../context/item_context/useItemContext";
import useDeleteItem from "../../hooks/tanstack_mutations/useDeleteItem";
import useUpdateItem from "../../hooks/tanstack_mutations/useUpdateItem";

export default function EditItemForm() {
  const { itemToEdit, setItemToEdit } = useItemContext();
  const DeleteItem = useDeleteItem();
  const UpdateItem = useUpdateItem();
  const [formData, setFormData] = useState({
    name: itemToEdit.name,
    isAvailable: itemToEdit.is_available,
  });

  useEffect(
    () => setFormData({ ...formData, name: itemToEdit.name }),
    [itemToEdit]
  );

  const HandleUpdateItem = async (e) => {
    e.preventDefault();
    if (formData.name == "") return;

    UpdateItem.mutate(
      {
        item_id: itemToEdit.id,
        name: formData.name,
        is_available: formData.isAvailable,
      },
      { onSuccess: (data) => setItemToEdit(data) }
    );
  };

  const HandleDeleteItem = async (e) => {
    DeleteItem.mutate(
      { item_id: itemToEdit.id },
      {
        onSuccess: () => {
          setItemToEdit(null);
        },
      }
    );
  };

  return (
    <form
      onSubmit={HandleUpdateItem}
      className="flex flex-col w-full items-center gap-4 bg-slate-800 py-6"
    >
      <Input
        id="name"
        placeholder="Item..."
        value={formData.name}
        withLabel
        labelText="Name:"
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <Checkbox
        id="isAvailableCheckbox"
        labelText="Available"
        onChange={() =>
          setFormData({ ...formData, isAvailable: !formData.isAvailable })
        }
        value={formData.isAvailable}
      />
      <Button
        disabled={UpdateItem.isPending || DeleteItem.isPending}
        text={itemToEdit === null ? "Submit" : "Update"}
        type="submit"
      />
      <div className="flex flex-col gap-4">
        <Button
          disabled={UpdateItem.isPending || DeleteItem.isPending}
          text="Cancel"
          onClick={() => setItemToEdit(null)}
        />
        <Button
          disabled={UpdateItem.isPending || DeleteItem.isPending}
          text="Delete"
          styles=" bg-red-500"
          onClick={HandleDeleteItem}
        />
      </div>
    </form>
  );
}
