import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from './components/ui/button'
import { BrowserRouter,Routes,Route ,Navigate} from 'react-router-dom'
import Auth from './Pages/auth'
import Profile from './Pages/profile'
import Chat from './Pages/chat'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth/>}></Route>
          <Route path="/chat" element={<Chat/>}></Route>
          <Route path="/profile" element={<Profile/>}></Route>
          <Route path="*" element={<Navigate to="/auth"/>}></Route>
        </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
