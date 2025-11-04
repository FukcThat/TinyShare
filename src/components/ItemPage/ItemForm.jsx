import { useState } from "react";
import Button from "../ui/Button";
import { useGlobal } from "../../context/useGlobal";
import Input from "../ui/Input";
import Checkbox from "../ui/Checkbox";
import { useItemContext } from "../../context/item_context/useItemContext";
import { useSession } from "../../context/session_context/useSession";
import { supabase } from "../../lib/supabaseClient";

export default function ItemForm() {
  const { session } = useSession();
  const { setItems, items } = useGlobal();
  const { itemToEdit } = useItemContext();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    isAvailable: true,
  });

  const CreateItem = async (e) => {
    e.preventDefault();
    if (formData.name == "") return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("items")
        .insert([
          {
            owner: session.user.id,
            name: formData.name,
            is_available: formData.isAvailable,
          },
        ])
        .select("id, owner, name, is_available, item_reservations(*)");

      if (error) throw new Error(error.message);
      setItems((old) => [...old, ...data]);
      setFormData({ ...formData, name: "" });
    } catch (error) {
      console.error("Create Item Error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={CreateItem}
      className="flex flex-col w-full items-center gap-4 bg-slate-800 py-6"
    >
      <Input
        disabled={isLoading}
        id="name"
        placeholder="Item..."
        value={formData.name}
        withLabel
        labelText="Name:"
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <Checkbox
        disabled={isLoading}
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
    </form>
  );
}
