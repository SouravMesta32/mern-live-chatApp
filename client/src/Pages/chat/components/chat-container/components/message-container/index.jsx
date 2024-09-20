import { apiclient } from "@/lib/api-client";
import { useAppStore } from "@/store"
import { GET_ALL_MESSAGES_ROUTE } from "@/utils/constants";
import moment from "moment";
import { useEffect } from "react";
import { useRef } from "react"


const MessageContainer = () => {
  const ScrollRef = useRef();
  const {SelectedChatData,SelectedChatType,userInfo,SelectedChatMessages,setSelectedChatMessages} = useAppStore();


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

  const renderDmMessage = (message)=> (
    <div className={`${message.sender === SelectedChatData._id ? "text-left" : "text-right"}`}>
      {
        message.messageType === "text" && (
          <div className={`${message.sender !== SelectedChatData._id ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"} border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>
            {message.content}
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
    </div>
  )
}

export default MessageContainer