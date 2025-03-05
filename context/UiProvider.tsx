'use client'
import { createContext } from "react";

interface UiContextType {
  isSidebarOpen: boolean;
}
export const UiContext = createContext<UiContextType | null>(null);

const UiProvider = ({ children }) => {
  return (
    <UiContext.Provider value={{ isSidebarOpen: false }}>
        {children}
    </UiContext.Provider>
  );
};

export default UiProvider;
