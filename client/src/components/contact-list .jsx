import { getColors } from "@/lib/utils"
import { useAppStore } from "@/store"
import { HOST } from "@/utils/constants"
import { Avatar, AvatarImage } from "./ui/avatar"


const ContactList = ({contacts , isChannel = false}) => {
    const {SelectedChatData,setSelectedChatData,SelectedChatType,setSelectedChatType} = useAppStore()

    const handleClick = (contacts) =>{
        if(isChannel){
            setSelectedChatType("channel")
        }else
        {
            setSelectedChatType("contact")
        }

        setSelectedChatData(contacts);
        if(setSelectedChatData && setSelectedChatData._id !== contacts.id){
            
        }
    }

  return (
    <div className="mt-5">
        {contacts.map(contact=> <div key={contact._id} className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${SelectedChatData && SelectedChatData._id === contact._id ? "bg-[#8417ff] hover:bg-[#8417ff]" : "hover:bg-[#f1f1f111]"}`} onClick={()=>handleClick(contact)}>

            <div className="flex gap-5 items-center justify-start text-neutral-300">
                {
                    !isChannel && (<Avatar className="h-10 w-10 rounded-full overflow-hidden">{
                        contact.image ? (<AvatarImage 
                          src={`${HOST}/${contact.image}`} 
                          alt='profile' 
                          className="object-cover w-full h-full bg-black"/>
                          ) : 
                          (
                            <div className={` ${SelectedChatData && SelectedChatData._id === contact._id ? 
                                "bg-[#ffffff22] border border-white/70": 
                                getColors(contact.color)} 
                            uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full `}>
                            {contact.firstname ? contact.firstname.split("").shift() : contact.email.split("").shift()}
                            </div>)
                      }
                      </Avatar>)
                }
                {
                    isChannel && <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                        #
                    </div> 
                }
                {
                    isChannel ? <span>{contact.name}</span> : <span>{`${contact.firstname} ${contact.lastname}`}</span>
                }
            </div>
            
        </div>


        )}
    </div>
  )
}

export default ContactList