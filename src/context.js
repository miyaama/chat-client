import { useContext, createContext, useState } from "react";

const RootContext = createContext(undefined);

const Provider = RootContext.Provider;

export const RootProvider = ({ children }) => {
  const [name, setName] = useState("");

  return <Provider value={{ name, setName }}>{children}</Provider>;
};

export function useName() {
  const context = useContext(RootContext);

  if (context === undefined) {
    throw new Error("Root context must be used within RootContextProvider");
  }

  return context;
}
