import { useMemo, useState } from "react";
import ItemForm from "../components/ItemPage/ItemForm";
import ItemListView from "../components/ItemPage/ItemListView";
import Button from "../components/ui/Button";
import { useGlobal } from "../context/useGlobal";
import EditItemView from "../components/ItemPage/EditItemView";
import ItemReservationModal from "../components/ItemPage/ItemReservationModal";
import AvailabilityCheck from "../components/ItemPage/AvailabilityCheck";
import { HasReservationConflict } from "../lib/HasReservationConflict";

const HasAvailibilityConflict = (itemId, reservations, startTime, endTime) => {
  const reservationsOfItem = reservations.filter(
    (res) => res.itemId === itemId
  );

  return HasReservationConflict(reservationsOfItem, startTime, endTime);
};

export default function ItemsPage() {
  const { user, items, reservations } = useGlobal();
  const [isOpen, setIsOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [itemToRequest, setItemToRequest] = useState(null);
  const [availabilityFilterDates, setAvailabilityFilterDates] = useState(null);

  const availableItems = useMemo(
    () =>
      items.filter((item) => {
        if (!availabilityFilterDates)
          return item.isAvailable && item.owner != user.id;
        else {
          return (
            item.isAvailable &&
            item.owner != user.id &&
            !HasAvailibilityConflict(
              item.id,
              reservations,
              availabilityFilterDates.start,
              availabilityFilterDates.end
            )
          ); // get all the reservations of this item and see if any of those have overlap
        }
      }),
    [items, availabilityFilterDates]
  );

  const yourItems = useMemo(
    () => items.filter((item) => item.owner === user.id),
    [items]
  );

  const ToggleItemForm = () => setIsOpen(!isOpen);

  return (
    <div className="flex flex-col gap-10 relative">
      {isOpen && <ItemForm ToggleForm={ToggleItemForm} />}
      <Button text="Add Item" onClick={ToggleItemForm} />

      <AvailabilityCheck
        setAvailabilityFilterDates={setAvailabilityFilterDates}
      />
      <ItemListView
        items={yourItems}
        headerLabel={"Your Items"}
        withEdit
        onRequest={(item) => {
          setItemToRequest(item);
        }}
        onEdit={(newItem) =>
          setItemToEdit((old) =>
            old === null || old.id != newItem.id ? newItem : null
          )
        }
      />

      <ItemListView
        items={availableItems}
        headerLabel={"Available Items"}
        onRequest={(item) => {
          setItemToRequest(item);
        }}
      />

      {itemToRequest && (
        <ItemReservationModal
          item={itemToRequest}
          onClose={() => setItemToRequest(null)}
        />
      )}

      {itemToEdit && (
        <EditItemView itemToEdit={itemToEdit} setItemToEdit={setItemToEdit} />
      )}
    </div>
  );
}
