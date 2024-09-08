import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from './components/ui/button'
import { BrowserRouter,Routes,Route ,Navigate} from 'react-router-dom'
import Auth from './Pages/auth'
import Profile from './Pages/profile'
import Chat from './Pages/chat'
import { useAppStore } from './store/index'
import { apiclient } from './lib/api-client'
import { GET_USER_INFO } from './utils/constants'


const PrivatRoute = ({children})=>{
  const {userInfo} = useAppStore();
  const isAuthenticated = !userInfo;
  return isAuthenticated ? children : <Navigate to="/auth"/>;
}

const AuthRoute = ({children})=>{
  const {userInfo} = useAppStore();
  const isAuthenticated = !userInfo;
  return isAuthenticated ? <Navigate to="/chat"/> : children;
}

function App() {
  const { userInfo, setUserInfo } = useAppStore();
  const {loading, setLoading} = useState();
  useEffect(()=>{
    const getUserData = async ()=>{
      try{

      const response = await apiclient.get(GET_USER_INFO,{withCredentials:true});
      console.log({response})
      }catch(error){

        console.log({error})
      }
    }

    if(!userInfo){
      getUserData();
    }else{
      setLoading(false)
    }

  },[userInfo,setUserInfo])
  
  if(loading){
    return <div>Loading.....</div>
  }

  return (
    <>
      <div>
        <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthRoute><Auth/></AuthRoute>}></Route>
          <Route path="/chat" element={<PrivatRoute><Chat/></PrivatRoute>}></Route>
          <Route path="/profile" element={<PrivatRoute><Profile/></PrivatRoute>}></Route>
          <Route path="*" element={<Navigate to="/auth"/>}></Route>
        </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
