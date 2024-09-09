import { useAppStore } from "@/store/index"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
    <div>Chat</div>
  )
  }

export default Chat