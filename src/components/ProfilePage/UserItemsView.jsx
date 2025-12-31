import Button from "../ui/Button";
import ItemView from "../global/ItemView";
import ItemForm from "./ItemForm";
import { useState } from "react";

export default function UserItemsView({ items }) {
  const [isOpen, setIsOpen] = useState(false);

  const ToggleItemForm = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-secondary p-4 rounded-xl flex flex-col justify-between w-[90%] gap-4">
      <div className="flex justify-between w-full items-center">
        <h3>My Items</h3>
        <Button
          text="+ Add Item"
          styles="bg-primary"
          onClick={ToggleItemForm}
        />
      </div>
      {isOpen && <ItemForm setIsOpen={setIsOpen} />}
      <div className="grid grid-flow-row lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
        {items?.map((item) => (
          <ItemView key={item.id} item={item} isOwner />
        ))}
      </div>
    </div>
  );
}
