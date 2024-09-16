export const createChatSlice = (set,get)=>({
    SelectedChatType:undefined,
    SelectedChatData:undefined,
    SelectedChatMessages:[],
    setSelectedChatType: (SelectedChatType) => set({SelectedChatType}),
    setSelectedChatData: (SelectedChatData)=> set({SelectedChatData}),
    setSelectChatMessages: (SelectedChatMessages)=>set({SelectedChatMessages}),
    closeChat:()=>set({SelectedChatData:undefined,SelectedChatType:undefined,SelectedChatMessages:[]})
})