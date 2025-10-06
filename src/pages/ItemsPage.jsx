import { useMemo, useState } from "react";
import ItemForm from "../components/ItemPage/ItemForm";
import ItemListView from "../components/ItemPage/ItemListView";
import Button from "../components/ui/Button";
import { useGlobal } from "../context/useGlobal";
import { itemData } from "../data/itemData";

export default function ItemsPage() {
  const { user, items } = useGlobal();
  const availableItems = useMemo(() => {
    return items.filter((item) => item.status === "available");
  }, [items]);
  const yourItems = useMemo(() => {
    return items.filter((item) => item.owner === user.id);
  }, [items]);
  const [isOpen, setIsOpen] = useState(false);

  const ToggleItemForm = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col gap-10">
      <Button text="Add Item" onClick={ToggleItemForm} />
      {isOpen && <ItemForm />}
      <ItemListView items={yourItems} headerLabel={"Your Items"} />
      <ItemListView items={availableItems} headerLabel={"Available Items"} />
    </div>
  );
}
