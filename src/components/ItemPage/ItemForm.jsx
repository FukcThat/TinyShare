import { useEffect, useState } from "react";
import Button from "../ui/Button";
import { Item } from "../../data/itemData";
import { v4 as uuidv4 } from "uuid";
import { useGlobal } from "../../context/useGlobal";
import Input from "../ui/Input";
import Checkbox from "../ui/Checkbox";

export default function ItemForm({
  itemToEdit = null,
  setItemToEdit = () => {},
  ToggleForm = () => {},
}) {
  const { user, setItems, UpdateItem, DeleteItem } = useGlobal();

  const [formData, setFormData] = useState({
    name: itemToEdit ? itemToEdit.name : "",
    isAvailable: itemToEdit ? itemToEdit.isAvailable : true,
  });

  useEffect(() => {
    if (itemToEdit === null) return;
    setFormData({ ...formData, name: itemToEdit.name });
  }, [itemToEdit]);

  const CreateItem = (e) => {
    e.preventDefault();
    if (formData.name == "") return;

    if (itemToEdit === null) {
      const newItem = new Item(
        uuidv4(),
        formData.name,
        formData.isAvailable,
        user.id
      );
      setItems((oldItems) => [...oldItems, newItem]);
      setFormData({ ...formData, name: "" });
      ToggleForm();
      return;
    }

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
      {itemToEdit && (
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
      )}
    </form>
  );
}
