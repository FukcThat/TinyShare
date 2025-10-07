import { useState } from "react";
import { userData } from "../data/userData";
import { GlobalContext } from "./GlobalContext";
import { communityData } from "../data/communityData";
import { itemData } from "../data/itemData";

export function GlobalProvider({ children }) {
  const [user, setUser] = useState(userData[1]);
  const [items, setItems] = useState(itemData);
  const [activeCommunity, setActiveCommunity] = useState(communityData[0]);

  const UpdateItem = (id, newData) => {
    setItems((oldItems) =>
      oldItems.map((item) => {
        if (item.id === id) return { ...item, name: newData.name };
        return item;
      })
    );
  };

  const DeleteItem = (id) => {
    setItems((oldItems) => oldItems.filter((item) => item.id !== id));
  };

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        activeCommunity,
        setActiveCommunity,
        items,
        setItems,
        UpdateItem,
        DeleteItem,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
