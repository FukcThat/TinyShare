import { useEffect, useMemo } from "react";
import ItemForm from "../components/ItemPage/ItemForm";
import ItemListView from "../components/ItemPage/ItemListView";
import Button from "../components/ui/Button";
import { useGlobal } from "../context/useGlobal";
import ItemReservationModal from "../components/ItemPage/ItemReservationModal";
import AvailabilityCheck from "../components/ItemPage/AvailabilityCheck";
import { HasReservationConflict } from "../lib/HasReservationConflict";
import { useItemContext } from "../context/item_context/useItemContext";
import EditItemForm from "../components/ItemPage/EditItemForm";
import { useNavigate } from "react-router";
import { useSession } from "../context/session_context/useSession";

export default function ItemsPage() {
  const { session } = useSession();
  const { items, activeCommunity } = useGlobal();

  const {
    availabilityFilterDates,
    isOpen,
    ToggleItemForm,
    itemToRequest,
    itemToEdit,
  } = useItemContext();
  const nav = useNavigate();

  useEffect(() => {
    if (!activeCommunity) return;
    if (activeCommunity.id === -1) nav("/");
  }, [activeCommunity]);

  const availableItems = useMemo(
    () =>
      items
        ? items.filter((item) => {
            if (!availabilityFilterDates)
              return item.is_available && item.owner != session.user.id;
            else {
              return (
                item.is_available &&
                item.owner != session.user.id &&
                !HasReservationConflict(
                  item.item_reservations,
                  availabilityFilterDates.start,
                  availabilityFilterDates.end
                )
              ); // get all the reservations of this item and see if any of those have overlap
            }
          })
        : null,
    [items, availabilityFilterDates]
  );

  const yourItems = useMemo(
    () =>
      items ? items.filter((item) => item.owner === session.user.id) : null,
    [items]
  );

  if (!activeCommunity || activeCommunity.id === -1) return null;
  return (
    <div className="flex flex-col gap-10 relative">
      {isOpen && <ItemForm />}
      <Button text="Add Item" onClick={ToggleItemForm} />
      <AvailabilityCheck />
      <ItemListView items={yourItems} headerLabel={"Your Items"} />
      <ItemListView items={availableItems} headerLabel={"Available Items"} />

      {itemToRequest && <ItemReservationModal />}

      {itemToEdit && (
        <div className="h-screen w-[30%] absolute right-0 bg-slate-800">
          <EditItemForm />
        </div>
      )}
    </div>
  );
}
