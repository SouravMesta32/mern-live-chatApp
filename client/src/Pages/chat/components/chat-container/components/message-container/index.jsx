import { apiclient } from "@/lib/api-client";
import { useAppStore } from "@/store"
import { GET_ALL_MESSAGES_ROUTE, HOST } from "@/utils/constants";
import moment from "moment";
import { useEffect, useState } from "react";
import { useRef } from "react"
import {MdFolderZip} from "react-icons/md"
import {IoMdArrowRoundDown} from "react-icons/io"
import { IoCloseSharp } from "react-icons/io5";


const MessageContainer = () => {
  const ScrollRef = useRef();
  const {SelectedChatData,SelectedChatType,userInfo,SelectedChatMessages,setSelectedChatMessages} = useAppStore();
  const [showImage, setShowImage] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)


  useEffect(()=>{

    const getMessages = async ()=>{
      try {
        const response = await apiclient.post(GET_ALL_MESSAGES_ROUTE,{id:SelectedChatData._id},{withCredentials:true})
        if(response.data.messages){
          setSelectedChatMessages(response.data.messages)
        }
      } catch (error) {
        console.log({error})
      }
    }
    if(SelectedChatData._id){
      if(SelectedChatType === "contact"){
        getMessages()
      }
    }


  },[SelectedChatData,SelectedChatType,setSelectedChatMessages])

  useEffect(()=>{
    if(ScrollRef.current){
      ScrollRef.current.scrollIntoView({behaviour:"smooth"})
    }
  },[SelectedChatMessages])

  const renderMessages = ()=>{
    let lastDate = null;
    return SelectedChatMessages.map((message,index)=>{
      const messageDate = moment(message.timeStamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (<div key={index}>
        {showDate && (<div className="text-center text-gray-500 my-2">
          {moment(message.timeStamp).format("LL")}</div>)}
          {
            SelectedChatType === "contact" && renderDmMessage(message) 
          }
      </div>)
    })
  }

  const downloadFile = async (url) =>{
    const response = await apiclient.get(`${HOST}/${url}`,{responseType:"blob"})
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download",url.split("/").pop())
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob)

  }

  const checkIfImage = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|tiff|tif|wevp|svg|ico|heic|)$/i;
    return imageRegex.test(filePath)
  }

  const renderDmMessage = (message)=> (
    <div className={`${message.sender === SelectedChatData._id ? "text-left" : "text-right"}`}>
      {
        message.messageType === "text" && (
          <div className={`${message.sender !== SelectedChatData._id ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"} border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>
            {message.content}
          </div>
        )
      }
      {
        message.messageType === "file" &&  (
          <div className={`${message.sender !== SelectedChatData._id ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"} border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>
            {checkIfImage(message.fileUrl) ? <div className="cursor-pointer " onClick={()=>{
              setShowImage(true);
              setImageUrl(message.fileUrl)}}>
              {
                <img src={`${HOST}/${message.fileUrl}`} width={300}/>
              }
            </div> : 
            
            <div className="flex items-center justify-center gap-5">
              <span className="text-white/8 text-3xl bg-black/20 rounded-full p-3">
                <MdFolderZip></MdFolderZip>
              </span>  
              <span>
                {message.fileUrl.split('/').pop()}
              </span>
              <span className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300" onClick={()=>downloadFile(message.fileUrl)}>
                <IoMdArrowRoundDown></IoMdArrowRoundDown>
              </span>
            </div>}
          </div>
        )
      }
      <div className="text-xs text-gray-600">
        {moment(message.timeStamp).format("LT")}
      </div>
    </div>
  )

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full ">
      {renderMessages()}
      <div ref={ScrollRef}></div>
      {
        showImage && <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
          <div >
            <img src={`${HOST}/${imageUrl}`} className="h-[80vh] w-full bg-cover"/>
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300" onClick={()=>downloadFile(imageUrl)}>
              <IoMdArrowRoundDown></IoMdArrowRoundDown>
            </button>
            <button className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300" onClick={()=>{setShowImage(false);
            setImageUrl(null)}}>
              <IoCloseSharp/>
            </button>
          </div>
        </div>
      }
    </div>
  )
}

export default MessageContainer