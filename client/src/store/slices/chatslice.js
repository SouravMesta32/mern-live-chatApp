
export const createChatSlice = (set,get)=>({
    SelectedChatType:undefined,
    SelectedChatData:undefined,
    SelectedChatMessages:[],
    directMessagesContacts:[],
    isUploading:false,
    isDownloading:false,
    fileUploadProgress:0,
    fileDownloadProgress:0,
    setIsUploading:(isUploading)=>set({isUploading}),
    setIsDownloading:(isDownloading)=>set({isDownloading}),
    setFileUploadProgress:(fileUploadProgress)=>set({fileUploadProgress}),
    setFileDownloadProgress:(fileDownloadProgress)=>set({fileDownloadProgress}),
    setSelectedChatType: (SelectedChatType) => set({SelectedChatType}),
    setSelectedChatData: (SelectedChatData)=> set({SelectedChatData}),
    setSelectedChatMessages: (SelectedChatMessages)=>set({SelectedChatMessages}),
    setDirectMessageContacts:(directMessagesContacts)=>set({directMessagesContacts}),
    closeChat:()=>set({SelectedChatData:undefined,SelectedChatType:undefined,SelectedChatMessages:[]}),
    addMessage:(message)=>{
        const SelectedChatMessages = get().SelectedChatMessages;
        const SelectedChatType = get().SelectedChatType;

        set({
            SelectedChatMessages:[
                ...SelectedChatMessages,{
                    ...message,
                    recipient: 
                        SelectedChatType === "channel" ? message.recipient : message.recipient._id,
                    sender:
                        SelectedChatType === "channel" ? message.sender : message.sender._id,


                }
            ]
        })
    }
})