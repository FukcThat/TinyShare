import { useEffect, useState } from "react";
import Button from "../ui/Button";
import { useGlobal } from "../../context/useGlobal";
import Input from "../ui/Input";
import Checkbox from "../ui/Checkbox";
import { useItemContext } from "../../context/item_context/useItemContext";
import { supabase } from "../../lib/supabaseClient";

export default function EditItemForm() {
  const { itemToEdit, setItemToEdit } = useItemContext();
  const { setItems } = useGlobal();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: itemToEdit.name,
    isAvailable: itemToEdit.is_available,
  });

  useEffect(
    () => setFormData({ ...formData, name: itemToEdit.name }),
    [itemToEdit]
  );

  const UpdateItem = async (e) => {
    e.preventDefault();
    if (formData.name == "") return;
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("items")
        .update({ name: formData.name, is_available: formData.isAvailable })
        .eq("id", itemToEdit.id)
        .select("id, owner, name, is_available, item_reservations(*)");

      if (error) throw new Error(error.message);

      setItems((old) =>
        old.map((item) => (item.id === itemToEdit.id ? data : item)).flat()
      );
      setItemToEdit(data[0]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const DeleteItem = async (e) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("items")
        .delete()
        .eq("id", itemToEdit.id);

      if (error) throw new Error(error.message);
      setItems((oldItems) =>
        oldItems.filter((item) => item.id !== itemToEdit.id)
      );
      setItemToEdit(null);
    } catch (error) {
      console.error("Delete Item Error: ", error);
    } finally {
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
