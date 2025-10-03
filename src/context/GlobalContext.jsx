import { createContext, useContext } from "react";

const GlobalContext = createContext(null);

export function GlobalProvider({ children }) {
  const test2 = "Test 2";
  return (
    <GlobalContext.Provider value={{ test2 }}>
      {children}
    </GlobalContext.Provider>
  );
}

export const UseGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error(":(");
  return context;
};
