import { useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Checkbox from "../ui/Checkbox";
import { useItemContext } from "../../context/item_context/useItemContext";
import useCreateItem from "../../hooks/tanstack_mutations/useCreateItem";
import { useSession } from "../../context/session_context/useSession";

export default function ItemForm() {
  const { session } = useSession();
  const { itemToEdit } = useItemContext();
  const [formData, setFormData] = useState({
    name: "",
    isAvailable: true,
  });
  const CreateItem = useCreateItem();

  const HandleCreateItem = async (e) => {
    e.preventDefault();
    if (formData.name == "") return;

    CreateItem.mutate(
      {
        owner: session.user.id,
        is_available: formData.isAvailable,
        name: formData.name,
      },
      {
        onSuccess: () => setFormData({ ...formData, name: "" }),
      }
    );
  };

  return (
    <form
      onSubmit={HandleCreateItem}
      className="flex flex-col w-full items-center gap-4 bg-slate-800 py-6"
    >
      <Input
        disabled={CreateItem.isPending}
        id="name"
        placeholder="Item..."
        value={formData.name}
        withLabel
        labelText="Name:"
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <Checkbox
        disabled={CreateItem.isPending}
        id="isAvailableCheckbox"
        labelText="Available"
        onChange={(e) =>
          setFormData({ ...formData, isAvailable: !formData.isAvailable })
        }
        value={formData.isAvailable}
      />
      <Button
        disabled={CreateItem.isPending}
        text={itemToEdit === null ? "Submit" : "Update"}
        type="submit"
      />
    </form>
  );
}
