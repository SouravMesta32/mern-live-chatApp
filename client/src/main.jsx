import { Snowflake, SofaIcon } from 'lucide-react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { useSonner } from 'sonner'
import App from './App.jsx'
import './index.css'
import { Toaster } from "@/components/ui/sonner"

createRoot(document.getElementById('root')).render(
  <>
    <App />
    <Toaster closeButton classname="bg-red-500"/>
  </>
)
