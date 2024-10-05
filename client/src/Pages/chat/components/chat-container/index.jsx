import React from 'react'
import ChatHeader from './components/chat-header'
import MessageBar from './components/message-bar'
import MessageContainer from './components/message-container'

const ChatContainer = () => {
  return (
    <div className="fixed inset-0 flex flex-col bg-[#1c1d25] md:static md:flex-1 overflow-hidden">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <MessageContainer />
      </div>
      <div className="sticky bottom-0 w-full">
        <MessageBar />
      </div>
    </div>
  )
}

export default ChatContainer