import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import { useState } from "react"
import { FaPlus } from "react-icons/fa"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { animationDefaultOptions } from "@/lib/utils"
import Lottie from "react-lottie"
  
  
const NewDm = () => {
    const [openContactModel, setOpenContactModel] = useState(false)
    const [searchedContacts, setSearchedContacts] = useState([])
    const SearchContacts = async (searchterm)=>{

    }
  return (
    <>
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger>
                <FaPlus className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300" onClick={()=>setOpenContactModel(true)}></FaPlus>
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
                <p>Select new contact</p>
            </TooltipContent>
            </Tooltip>
    </TooltipProvider>
    <Dialog open={openContactModel} onOpenChange={setOpenContactModel}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col ">
            <DialogHeader>
                <DialogTitle>Please select a Contact</DialogTitle>
                {/* <DialogDescription>
                
                </DialogDescription> */}
            </DialogHeader>
            <div>
                <Input placeholder="Search contact" className="rounded-lg p-6 bg-[#2c2e3b] border-none" onChange={e=>SearchContacts(e.target.value)}/>
            </div>
            {
                searchedContacts.length<=0 && <div className="flex1 md:bg-[#1c1d25] mt-5 md:flex flex-col justify-center items-center duration-1000 transition-all">
                <Lottie
                isClickToPauseDisabled={true} height={100} width={100} options={animationDefaultOptions}/>
                <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-6 lg:text-2xl text-xl transition-all duration-300 text-center">
                  <h3 className="poppins-medium">
                    Hi <span className="text-purple-500">!</span> Search new
                    <span className="text-purple-500"> contact</span> 
                  </h3>
                </div>
              </div>
            }
        </DialogContent>
    </Dialog>


    </>
  )
}

export default NewDm