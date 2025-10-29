import { useState } from "react";
import Button from "../ui/Button";
import { useGlobal } from "../../context/useGlobal";
import Input from "../ui/Input";
import Checkbox from "../ui/Checkbox";
import { useItemContext } from "../../context/item_context/useItemContext";
import { useSession } from "../../context/session_context/useSession";
import { itemsApi } from "../../../mocks";

export default function ItemForm() {
  const { user } = useSession();
  const { setItems } = useGlobal();
  const { itemToEdit } = useItemContext();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    isAvailable: true,
    userId: user.id,
  });

  const CreateItem = async (e) => {
    e.preventDefault();
    if (formData.name == "") return;
    setIsLoading(true);
    try {
      const res = await itemsApi.createItem(formData);
      if (!res.ok) throw new Error(res);
      setItems((oldItems) => [...oldItems, res.newItem]);
      setFormData({ ...formData, name: "" });
      setIsLoading(false);
    } catch (error) {
      console.error("Create Item Error: ", error);
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
