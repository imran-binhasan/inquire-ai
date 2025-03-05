"use client";
import { useContext } from "react";
import Aside from "@/components/aside/Aside";
import Header from "@/components/header/Header";
import { UiContext } from "@/context/UiProvider";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen, setIsSidebarOpen } = useContext(UiContext);

  return (
    <div className="flex w-full">
      <div 
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg 
          md:hidden
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen 
            ? "translate-x-0" 
            : "-translate-x-full"
          }
        `}
      >
        <Aside />
      </div>

      {isSidebarOpen && (
        <div className="hidden md:block w-64">
          <Aside />
        </div>
      )}

      <main className="flex flex-1 flex-col">
        <Header />
        {children}
      </main>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}