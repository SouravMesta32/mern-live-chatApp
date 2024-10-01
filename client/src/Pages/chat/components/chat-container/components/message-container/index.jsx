import { apiclient } from "@/lib/api-client";
import { useAppStore } from "@/store"
import { GET_ALL_MESSAGES_ROUTE, GET_CHANNEl_MESSAGES, HOST } from "@/utils/constants";
import moment from "moment";
import { useEffect, useState } from "react";
import { useRef } from "react"
import {MdFolderZip} from "react-icons/md"
import {IoMdArrowRoundDown} from "react-icons/io"
import { IoCloseSharp } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getColors } from "@/lib/utils";


const MessageContainer = () => {
  const ScrollRef = useRef(null);
  const {SelectedChatData,SelectedChatType,userInfo,SelectedChatMessages,setSelectedChatMessages,setFileDownloadProgress,setIsDownloading} = useAppStore();
  const [showImage, setShowImage] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)
  const [loadingMessages, setLoadingMessages] = useState(false)


  useEffect(()=>{

    const getMessages = async ()=>{
      try {
        setLoadingMessages(true)
        const response = await apiclient.post(GET_ALL_MESSAGES_ROUTE,{id:SelectedChatData._id},{withCredentials:true})
        if(response.data.messages){
          setSelectedChatMessages(response.data.messages)
        }
      } catch (error) {
        console.log({error})
      } finally{
        setLoadingMessages(false)
      }
    }

    const getChannelMessages = async ()=>{
      try {
        setLoadingMessages(true)
        const response = await apiclient.get(`${GET_CHANNEl_MESSAGES}/${SelectedChatData._id}`,{withCredentials:true})
        if(response.data.messages){
          setSelectedChatMessages(response.data.messages)
        }
      } catch (error) {
        console.log({error})
      } finally {
        setLoadingMessages(false)
      }
    }

    if(SelectedChatData._id){
      if(SelectedChatType === "contact"){
        getMessages()
      }else if(SelectedChatType === "channel"){
        getChannelMessages();
      }
    }


  },[SelectedChatData,SelectedChatType,setSelectedChatMessages])

  useEffect(()=>{

    const ScrollToBottom = ()=>
    {if(ScrollRef.current){
      ScrollRef.current.scrollIntoView({block:"end"})
    }}
    // if (ScrollRef.current) {
    //   ScrollRef.current.scrollTop = ScrollRef.current.scrollHeight; // Scroll to bottom directly
    // }
    setTimeout(ScrollToBottom,100)
    
  },[SelectedChatMessages,SelectedChatData])

  

  const renderMessages = ()=>{
    if(loadingMessages){
      return <div className="text-center text-gray-500 my-2">Loading messages...</div>; 
    }
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
          {
            SelectedChatType === "channel" && renderChannelMessages(message)
          }
      </div>)
    })
  }

  const downloadFile = async (url) =>{
    setIsDownloading(true)
    setFileDownloadProgress(0)
    const response = await apiclient.get(`${HOST}/${url}`,{responseType:"blob",onDownloadProgress:(ProgressEvent)=>{
      const {loaded,total} = ProgressEvent;
      const percentCompleted = Math.round((loaded*100)/total);
      setFileDownloadProgress(percentCompleted)}
    })
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download",url.split("/").pop())
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob)
    setIsDownloading(false)
    setFileDownloadProgress(0)

  }

  const checkIfImage = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|tiff|tif|wevp|svg|ico|heic|)$/i;
    return imageRegex.test(filePath)
  }


  const renderChannelMessages = (message)=>{
    return (<div className={`mt-5 ${message.sender._id !== userInfo.id ? "text-left" : "text-right" } `}>
      {
        message.messageType === "text" && (
          <div className={`${message.sender._id === userInfo.id ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"} border inline-block p-4 rounded my-1 max-w-[50%] break-words ml-9`}>
            {message.content}
          </div>
        )
      }
      {
        message.messageType === "file" &&  (
          <div className={`${message.sender._id === userInfo.id ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"} border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>
            {message.fileUrl && (checkIfImage(message.fileUrl) ? <div className="cursor-pointer " onClick={()=>{
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
            </div>)}
          </div>
        )
      }
      {
        message.sender._id !== userInfo.id ? <div className="flex items-center justify-start gap-3">
           <Avatar className="h-8 w-8 rounded-full overflow-hidden">{
                    message.sender.image && (<AvatarImage 
                      src={`${HOST}/${message.sender.image}`} 
                      alt='profile' 
                      className="object-cover w-full h-full bg-black"/>
                      )} 
                      
                    <AvatarFallback className={`uppercase h-8 w-8  text-lg flex items-center justify-center   rounded-full ${getColors(message.sender.color)}`}>
                      {message.sender?.firstname?.[0] || message.sender?.email?.[0]}  
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-white/60">
                    {
                      `${message.sender.firstname} ${message.sender.lastname}`
                    }
                  </span>
                  <span className="text-xs text-white/60">
                    {
                      moment(message.timeStamp).format("LT")
                    }
                  </span>
                  

        </div> : (
          <div className="text-xs text-white/60 mt-1">
          {
            moment(message.timeStamp).format("LT")
          }
        </div>
        )
      }
    </div>
    
    )

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
    <div  ref={ScrollRef} className="flex-1 overflow-y-auto scrollbar-hidden scrollbar-black p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full ">
      {renderMessages()}
      <div ref={ScrollRef} ></div>
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