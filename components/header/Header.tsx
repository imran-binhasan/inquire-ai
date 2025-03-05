"use client";
import { UiContext } from "@/context/UiProvider";
import { ChevronsRight,ChevronsLeft, Share } from "lucide-react"
import { useContext } from "react";


const Header = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useContext(UiContext)
  console.log(isSidebarOpen);
  return (
   <header className=" border">
     <div className="flex justify-between gap-2 p-2 top-3 right-3 items-center ">
     {isSidebarOpen ? (
        <ChevronsLeft onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      ) : (
        <ChevronsRight onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      )}

      <div className="flex gap-2 items-center">
      <button className="flex items-center gap-2 border py-1 px-2 rounded-lg">
        <Share size={16} /> Share
      </button>
      <button>
        <img className="w-8 h-8 rounded-full" src={"/user.png"} alt="logo" />
      </button>
      </div>
    </div>
   </header>
  )
}

export default Header