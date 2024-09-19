import { Snowflake, SofaIcon } from 'lucide-react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { useSonner } from 'sonner'
import App from './App.jsx'
import './index.css'
import { Toaster } from "@/components/ui/sonner"
import { SocketProvider } from './context/socketContext.jsx'

createRoot(document.getElementById('root')).render(
  <SocketProvider>
    <App />
    <Toaster closeButton classname="bg-red-500"/>
  </SocketProvider>
)
