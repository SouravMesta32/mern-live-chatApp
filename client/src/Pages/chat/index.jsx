import { useAppStore } from "@/store/index"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ChatContainer from "./components/chat-container";
import ContactsContainer from "./components/contact-container";
import EmptyChatContainer from "./components/empty-chat-container";

const Chat = () => {
  const { userInfo } = useAppStore();
  const navigate = useNavigate();
  
  useEffect(()=>{

    console.log("userinfo:" + userInfo)
    if(!userInfo.profilesetup)
    {
      toast("Please set up your profile to continue");
      navigate("/profile");
    }
  },[userInfo,navigate])

  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      <ContactsContainer/>
      {/* <EmptyChatContainer/> */}
      <ChatContainer/>
    </div>
  )
  }

export default Chat