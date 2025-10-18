import { useState } from "react";
import { ItemContext } from "./ItemContext";

export default function ItemContextProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [itemToRequest, setItemToRequest] = useState(null);
  const [availabilityFilterDates, setAvailabilityFilterDates] = useState(null);

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
