
export const createChatSlice = (set,get)=>({
    SelectedChatType:undefined,
    SelectedChatData:undefined,
    SelectedChatMessages:[],
    directMessagesContacts:[],
    isUploading:false,
    isDownloading:false,
    fileUploadProgress:0,
    fileDownloadProgress:0,
    channels:[],
    setChannels:(channels)=>set({channels}),
    setIsUploading:(isUploading)=>set({isUploading}),
    setIsDownloading:(isDownloading)=>set({isDownloading}),
    setFileUploadProgress:(fileUploadProgress)=>set({fileUploadProgress}),
    setFileDownloadProgress:(fileDownloadProgress)=>set({fileDownloadProgress}),
    setSelectedChatType: (SelectedChatType) => set({SelectedChatType}),
    setSelectedChatData: (SelectedChatData)=> set({SelectedChatData}),
    setSelectedChatMessages: (SelectedChatMessages)=>set({SelectedChatMessages}),
    setDirectMessageContacts:(directMessagesContacts)=>set({directMessagesContacts}),
    closeChat:()=>set({SelectedChatData:undefined,SelectedChatType:undefined,SelectedChatMessages:[]}),
    addChannel:(channel)=>{
        const channels = get().channels
        set({channels:[channel,...channels]})
    },
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
    },
    addChannelInChannelList: (message) => {
        console.log(get().channels)

        const channels = get().channels;
        const data = channels.find((channel)=>channel._id === message.channelId)
        console.log(data)
        const index = channels.findIndex((channel)=>channel._id === message.channelId)
        console.log(index)

        if(index !== -1 && index !== undefined){

            channels.splice(index,1)
            channels.unshift(data)
            // const updatedChannel = [...channels]
            // updatedChannel.splice(index,1)
            // updatedChannel.unshift(data)
            // set({channels:updatedChannel})
            // console.log("Updated channels:", updatedChannel); 
        }
    },
     addContactsInDmContacts:(message)=>{
        const userId = get().userInfo.id;
        const fromId = message.sender._id === userId ? 
            message.recipient._id : message.sender._id
        const formData = message.sender._id === userId ? 
            message.recipient : message.sender
        const dmContacts = [...get().directMessagesContacts]
        const data = dmContacts.find((contact)=> contact._id === fromId)
        const index = dmContacts.findIndex((contact)=> contact._id === fromId)
        console.log("Updating contacts for message:", message); // Debugging line
        console.log("Current dmContacts:", dmContacts); // Debugging line
        if(index !== -1 && index !== undefined){
            dmContacts.splice(index,1)
            dmContacts.unshift(data)
        }else{
            dmContacts.unshift(formData)
        }

        set({directMessagesContacts:dmContacts})

    }
})