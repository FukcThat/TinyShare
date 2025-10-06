import { useState } from "react";
import { userData } from "../data/userData";
import { GlobalContext } from "./GlobalContext";
import { communityData } from "../data/communityData";
import { itemData } from "../data/itemData";

export function GlobalProvider({ children }) {
  const [user, setUser] = useState(userData[1]);
  const [items, setItems] = useState(itemData);
  const [activeCommunity, setActiveCommunity] = useState(communityData[0]);

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        activeCommunity,
        setActiveCommunity,
        items,
        setItems,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
