import { useEffect, useState } from "react";
import { ItemContext } from "./ItemContext";
import { useGlobal } from "../useGlobal";

export default function ItemContextProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [itemToRequest, setItemToRequest] = useState(null);
  const [availabilityFilterDates, setAvailabilityFilterDates] = useState(null);

  const { communityItems } = useGlobal();

  useEffect(() => {
    if (!itemToRequest || !communityItems) return;

    const updated = communityItems.find((i) => i.id === itemToRequest.id);
    if (updated) {
      setItemToRequest(updated);
    }
  }, [communityItems]);

  const ToggleItemForm = () => setIsOpen(!isOpen);

  return (
    <ItemContext.Provider
      value={{
        isOpen,
        ToggleItemForm,
        itemToEdit,
        setItemToEdit,
        itemToRequest,
        setItemToRequest,
        availabilityFilterDates,
        setAvailabilityFilterDates,
      }}
    >
      {children}
    </ItemContext.Provider>
  );
}
