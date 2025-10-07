import { useMemo, useState } from "react";
import ItemForm from "../components/ItemPage/ItemForm";
import ItemListView from "../components/ItemPage/ItemListView";
import Button from "../components/ui/Button";
import { useGlobal } from "../context/useGlobal";
import EditItemView from "../components/ItemPage/EditItemView";

export default function ItemsPage() {
  const { user, items } = useGlobal();
  const [isOpen, setIsOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);

  const availableItems = useMemo(
    () => items.filter((item) => item.status === "available"),
    [items]
  );

  const yourItems = useMemo(
    () => items.filter((item) => item.owner === user.id),
    [items]
  );

  const ToggleItemForm = () => setIsOpen(!isOpen);

  return (
    <div className="flex flex-col gap-10">
      {isOpen && <ItemForm />}
      <Button text="Add Item" onClick={ToggleItemForm} />
      <ItemListView
        items={yourItems}
        headerLabel={"Your Items"}
        withEdit
        onEdit={(newItem) =>
          setItemToEdit((old) =>
            old === null || old.id != newItem.id ? newItem : null
          )
        }
      />
      <ItemListView items={availableItems} headerLabel={"Available Items"} />
      {itemToEdit && (
        <EditItemView itemToEdit={itemToEdit} setItemToEdit={setItemToEdit} />
      )}
    </div>
  );
}
