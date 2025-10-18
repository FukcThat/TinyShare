import { useContext } from "react";
import { ItemContext } from "./ItemContext";

export const useItemContext = () => {
  const context = useContext(ItemContext);

  if (!context) throw new Error("Mh, no context here.");

  return context;
};
