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
import { animationDefaultOptions, getColors } from "@/lib/utils"
import Lottie from "react-lottie"
import { apiclient } from "@/lib/api-client"
import { HOST, SEARCH_ROUTE } from "@/utils/constants"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { useAppStore } from "@/store"
  
  
const NewDm = () => {
    const {setSelectedChatType,setSelectedChatData} = useAppStore();
    const [openContactModel, setOpenContactModel] = useState(false)
    const [searchedContacts, setSearchedContacts] = useState([])

    const SearchContacts = async (searchTerm)=>{
      try{
        if(searchTerm.length>0){
          const response = await apiclient.post(SEARCH_ROUTE,{ searchTerm },{withCredentials:true})
      
        if(response.status===200 && response.data.contacts)
        {
          setSearchedContacts(response.data.contacts)
        }
      }else{
        setSearchedContacts([])
      }
        
      }catch(err)
      {
        console.log(err);
      }

    }

    const selectNewContact = (contact)=>{
      setOpenContactModel(false);
      setSelectedChatType("contact")
      setSelectedChatData(contact)
      setSearchedContacts([]);

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
            <ScrollArea className="h-[250-px]">
              <div className="flex flex-col gap-5 ">
                {
                  searchedContacts.map(contact=><div key={contact._id} className="flex gap-3 items-center cursor-pointer" onClick={()=>selectNewContact(contact)}>
                    <div className="w-12 h-12 relative">
                      <Avatar className="h-12 w-12 rounded-full overflow-hidden">{
                          contact.image ? (<AvatarImage src={`${HOST}/${contact.image}`} alt='profile' className="object-cover w-full h-full bg-black rounded-full"/>) : (
                          <div className={`uppercase h-12 w-12 md:w-48 md:h-48 text-lg border-[1px] flex items-center justify-center rounded-full ${getColors(contact.color)}`}>
                          {contact.firstname ? contact.firstname.split("").shift() : contact.email.split("").shift()}
                          </div>)
                          }
                        </Avatar>
                      </div>
                      <div className="flex flex-col">
                        <span>{
                          contact.firstname && contact.lastname ? `${contact.firstname} ${contact.lastname}` : contact.email
                        }</span>
                        <span className="text-xs">{contact.email}</span>
                      </div>
                  </div>)
                }
              </div>
            </ScrollArea>
            {
                searchedContacts.length<=0 && <div className="flex1 md:bg-[#1c1d25] mt-5 md:flex flex-col justify-center items-center duration-1000 transition-all">
                <Lottie
                isClickToPauseDisabled={true} height={100} width={100} options={animationDefaultOptions}/>
                <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-6 lg:text-2xl text-xl transition-all duration-300 text-center">
                  <h3 className="poppins-medium mb-5">
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