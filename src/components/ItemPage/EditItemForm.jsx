import { useEffect, useState } from "react";
import Button from "../ui/Button";
import { useGlobal } from "../../context/useGlobal";
import Input from "../ui/Input";
import Checkbox from "../ui/Checkbox";
import { useItemContext } from "../../context/item_context/useItemContext";
import { itemsApi } from "../../../mocks";

export default function EditItemForm() {
  const { itemToEdit, setItemToEdit } = useItemContext();
  const { setItems } = useGlobal();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: itemToEdit.name,
    isAvailable: itemToEdit.isAvailable,
  });

  useEffect(
    () => setFormData({ ...formData, name: itemToEdit.name }),
    [itemToEdit]
  );

  const UpdateItem = async (e) => {
    e.preventDefault();
    if (formData.name == "") return;
    setIsLoading(true);
    try {
      let res = await itemsApi.updateItem(itemToEdit.id, formData);
      if (res.ok) {
        setItems((oldItems) =>
          oldItems.map((item) =>
            item.id === itemToEdit.id ? res.updatedItem : item
          )
        );
      }
      setIsLoading(false);
      setItemToEdit(res.updatedItem);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const DeleteItem = async (e) => {
    setIsLoading(true);
    try {
      let res = await itemsApi.deleteItem();
      if (!res.ok) throw new Error(res);
      setItems((oldItems) =>
        oldItems.filter((item) => item.id !== itemToEdit.id)
      );
      setIsLoading(false);
      setItemToEdit(null);
    } catch (error) {
      console.error("Delete Item Error: ", error);
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={UpdateItem}
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
      <Button
        disabled={isLoading}
        text={itemToEdit === null ? "Submit" : "Update"}
        type="submit"
      />
      <div className="flex flex-col gap-4">
        <Button
          disabled={isLoading}
          text="Cancel"
          onClick={() => setItemToEdit(null)}
        />
        <Button
          disabled={isLoading}
          text="Delete"
          styles=" bg-red-500"
          onClick={DeleteItem}
        />
      </div>
    </form>
  );
}
