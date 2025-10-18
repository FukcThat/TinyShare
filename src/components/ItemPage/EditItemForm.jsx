import { useEffect, useState } from "react";
import Button from "../ui/Button";
import { useGlobal } from "../../context/useGlobal";
import Input from "../ui/Input";
import Checkbox from "../ui/Checkbox";
import { useItemContext } from "../../context/item_context/useItemContext";

export default function EditItemForm() {
  const { UpdateItem, DeleteItem } = useGlobal();
  const { itemToEdit, setItemToEdit } = useItemContext();

  const [formData, setFormData] = useState({
    name: itemToEdit.name,
    isAvailable: itemToEdit.isAvailable,
  });

  useEffect(() => {
    setFormData({ ...formData, name: itemToEdit.name });
  }, [itemToEdit]);

  const CreateItem = (e) => {
    e.preventDefault();
    if (formData.name == "") return;
    UpdateItem(itemToEdit.id, formData);
    setItemToEdit(null);
  };

  return (
    <form
      onSubmit={CreateItem}
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
        onChange={(e) =>
          setFormData({ ...formData, isAvailable: !formData.isAvailable })
        }
        value={formData.isAvailable}
      />
      <Button text={itemToEdit === null ? "Submit" : "Update"} type="submit" />
      <div className="flex flex-col gap-4">
        <Button text="Cancel" onClick={() => setItemToEdit(null)} />
        <Button
          text="Delete"
          styles=" bg-red-500"
          onClick={() => {
            DeleteItem(itemToEdit.id);
            setItemToEdit(null);
          }}
        />
      </div>
    </form>
  );
}
