import { useState } from "react";
import Button from "../ui/Button";
import { Item } from "../../data/itemData";
import { v4 as uuidv4 } from "uuid";
import { useGlobal } from "../../context/useGlobal";

export default function ItemForm() {
  const { user, setItems } = useGlobal();
  const [formData, setFormData] = useState({ name: "" });

  const CreateItem = (e) => {
    e.preventDefault();

    if (formData.name == "") return;

    const newItem = new Item(uuidv4(), formData.name, "available", user.id);
    setItems((oldItems) => [...oldItems, newItem]);

    setFormData({ ...formData, name: "" });

    console.log("Create Item submitted", formData.name);
  };
  return (
    <form onSubmit={CreateItem}>
      <Button text="Submit" type="submit" />
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          placeholder="Item"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        ></input>
      </div>
    </form>
  );
}
