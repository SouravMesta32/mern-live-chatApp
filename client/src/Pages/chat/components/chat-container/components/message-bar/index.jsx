import { useSocket } from "@/context/socketContext"
import { apiclient } from "@/lib/api-client"
import { useAppStore } from "@/store"
import { UPLOAD_FILES_ROUTE } from "@/utils/constants"
import EmojiPicker from "emoji-picker-react"
import { useRef, useState , useEffect} from "react"
import {GrAttachment} from "react-icons/gr"
import { IoSend } from "react-icons/io5"
import { RiEmojiStickerLine } from "react-icons/ri"
const MessageBar = () => {
    const emojiRef = useRef();
    const fileInputRef = useRef();
    const socket = useSocket();
    const {SelectedChatType,SelectedChatData,userInfo,setIsUploading,setFileUploadProgress } = useAppStore()
    const [message, setMessage] = useState("");
    const [emojiPicker, setEmojiPicker] = useState(false)

    useEffect(()=>{
        function handleClickOutside(event){
            if(emojiRef.current && !emojiRef.current.contains(event.target))
            {
                setEmojiPicker(false)
            }
        }
        document.addEventListener("mousedown",handleClickOutside)
        return ()=>{
            document.removeEventListener("mousedown",handleClickOutside)
        }
    },[emojiRef])

    const handleAddEmoji = (emoji)=>{
        setMessage((msg)=>msg+emoji.emoji)
    }
    const handleSendMsg= async()=>{
        if(SelectedChatType === "contact"){
            socket.emit("sendMessage",{
                sender:userInfo.id,
                content:message,
                recipient:SelectedChatData._id,
                messageType:"text",
                fileUrl:undefined
            })
        } else if(SelectedChatType === "channel")
        {
            socket.emit("send-channel-message",{
                sender:userInfo.id,
                content:message,
                messageType:"text",
                fileUrl:undefined,
                channelId:SelectedChatData._id
            })
        }
        setMessage("")
    }

    const handleAttachmentClick =  () =>{
        if(fileInputRef.current)
        {
            fileInputRef.current.click()
        }
    }

    const handleAttachmentChange = async (event) => {
         try {
            const file = event.target.files[0];
            if(file)
            {
                const formData = new FormData();
                formData.append("file",file)
                setIsUploading(true)
                const response = await apiclient.post(UPLOAD_FILES_ROUTE,formData,{withCredentials:true,
                onUploadProgress:data=>setFileUploadProgress(Math.round((100*data.loaded)/data.total))
                })

                if(response.status === 200 && response.data)
                {
                    setIsUploading(false)
                    if(SelectedChatType === "contact")
                    {
                        socket.emit("sendMessage",{
                            sender:userInfo.id,
                            content: undefined,
                            recipient:SelectedChatData._id,
                            messageType:"file",
                            fileUrl:response.data.filePath
                        })
                    } else if(SelectedChatType === "channel"){
                        socket.emit("send-channel-message",{ 
                            sender:userInfo.id,
                            content:undefined,
                            messageType:"file",
                            fileUrl:response.data.filePath,
                            channelId:SelectedChatData._id
                        })
                    }
                }
                   
            }
            console.log(file);
         } catch (error) {
            setIsUploading(false)
            console.log({error})
         }
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSendMsg();
        }
    };

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-4 sm:px-2 mb-2 gap-4 sm:gap-2  ">
        <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
            <input 
                type="text" 
                className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none" placeholder="Enter the Message"
                value={message} 
                onChange={(e)=>{setMessage(e.target.value)}}
                onKeyDown={handleKeyPress}
            />
            <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all" onClick={handleAttachmentClick}>
                <GrAttachment className="text-2xl"/>
            </button>
            <input type="file" className="hidden" ref={fileInputRef} onChange={handleAttachmentChange}></input>
            <div className="relative">
            <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all" onClick={()=>setEmojiPicker(true)}>
                <RiEmojiStickerLine className="text-2xl"/>
            </button>
            <div className="absolute bottom-2 right-0"  ref={emojiRef}>
                <EmojiPicker
                theme="dark"
                open={emojiPicker}
                onEmojiClick={handleAddEmoji}
                autoFocusSearch={false}/>
            </div>
            </div>
        </div>
        <button className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 hover:bg-[#741bda] focus:bg-[#741bda] focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
         onClick={handleSendMsg}>
                <IoSend className="text-2xl"/>
            </button>
    </div>
  )
}

export default MessageBar