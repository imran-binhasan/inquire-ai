"use client";
import { useState } from "react";
import Aside from "@/components/aside/Aside";
import Header from "@/components/header/Header";



export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex w-full">
      {/* Sidebar - Overlay on small screens, static on larger screens */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Aside />
      </div>

      {/* Main Content */}
      <main className="flex flex-1 flex-col">
        <Header/>
        {children}
      </main>

      {/* Overlay (Only on small screens when sidebar is open) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
