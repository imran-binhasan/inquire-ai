import { ChevronsLeft, ChevronsRight, Share } from "lucide-react"


const Header = () => {
  return (
   <header className=" border">
     <div className="flex justify-between gap-2 p-2 top-3 right-3 items-center ">
     <ChevronsLeft/>
      <div className="flex gap-2 items-center">
      <button className="flex items-center gap-2 border py-1 px-2 rounded-lg">
        <Share size={16} /> Share
      </button>
      <button>
        <img className="w-8 h-8 rounded-full" src={"/logo.svg"} alt="logo" />
      </button>
      </div>
    </div>
   </header>
  )
}

export default Header