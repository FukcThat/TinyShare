import { useContext } from "react";
import { SessionContext } from "./SessionContext";

export const useSession = () => {
  const context = useContext(SessionContext);

  if (!context) throw new Error("Mh, no context here.");

  return context;
};
