import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { createContext, useContext, useEffect, useRef } from "react"
import { io } from "socket.io-client";


const SocketContext = createContext(null);

export const useSocket = ()=>{
    return useContext(SocketContext);
};

export const SocketProvider = ({children})=>{
    const socket = useRef();
    const {userInfo} = useAppStore();
    
    useEffect(()=>{
        if(userInfo)
        {
            socket.current = io(HOST,{
                withCredentials:true,
                query:{
                    userId:userInfo.id
                }
            });
            socket.current.on("connect",()=>{
                console.log("Connected to Socket Server")
            });

            const handleRecieveChannelMessage = (message) => {
                const {SelectedChatData,SelectedChatType,addMessage,addChannelInChannelList} = useAppStore.getState();
                if(SelectedChatType !== undefined && SelectedChatData._id === message.channelId){
                    addMessage(message)
                }
                addChannelInChannelList(message)
            }

            const handleRecieveMessage = (message)=>{
                const {SelectedChatData,SelectedChatType,addMessage,addContactsInDmContacts} = useAppStore.getState();

                if(SelectedChatType!==undefined && (SelectedChatData._id === message.sender._id || SelectedChatData._id === message.recipient._id)){
                    
                    console.log("message recieved",message)
                    addMessage(message)
                }
                addContactsInDmContacts(message)
            }

            socket.current.on("recieveMessage",handleRecieveMessage)
            socket.current.on("recieve-channel-message",handleRecieveChannelMessage)

            return ()=>{
                socket.current.disconnect();
            };
        }

    },[userInfo])

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    )
}