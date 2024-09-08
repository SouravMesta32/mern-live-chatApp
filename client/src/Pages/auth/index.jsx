import Background from "@/assets/login2.png"
import Victory from "@/assets/Victory.svg"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { apiclient } from "@/lib/api-client"
import { LOGIN_ROUTES, SIGNUP_ROUTES } from "@/utils/constants"
import { useNavigate } from "react-router-dom"
import { useAppStore } from "@/store"



const Auth = () => {

    const navigate = useNavigate();

    const {setUserInfo} = useAppStore();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmpassword, setConfirmPassword] = useState("")

    const validatelogin = ()=>{
        if(!email.length)
        {
            toast.error("Email is required")
            return false;
        }
        if(!password.length)
        {
            toast.error("Password is required");
            return false;
        }
        return true;
    }
    const validatesignup = ()=>{
        if(!email.length)
        {
            toast.error("Email is required")
            return false;
        }
        if(!password.length)
        {
            toast.error("Password is required");
            return false;
        }
        if(!password==confirmpassword)
        {
            toast.error("Password and confirm password should be same")
            return false;
        }
        return true;
    }

    const handlelogin = async ()=>{
        if(validatelogin()){
            const response = await apiclient.post(LOGIN_ROUTES,{email,password},{withCredentials:true})
            if(response.data.user.id){
                setUserInfo(response.data.user);
                if(response.data.user.profilesetup)
                {
                    navigate('/chat')
                }else
                {
                    navigate('/profile')
                }
            }
            console.log({response});
            
        }
    }

    const handlesignup = async ()=>{
        if(validatesignup())
        {
            const response = await apiclient.post(SIGNUP_ROUTES,{email,password},{withCredentials:true});
            if(response.status===201)
            {
                setUserInfo(response.data.user)
                navigate('/profile')
            }
            console.log({response});
        }


    }

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
        <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg: w-[70vw] xl:w-[60vw] rounded-3xl grid xl:gird-cols-2">
            <div className="flex flex-col gap-10 items-center justify-center"> 
            <div className="flex items-center justify-center flex-col">
                <div className="flex items-center justify-center">
                    <h1 className="text-5xl font-bold md:text-6xl ">Welcome</h1>
                    <img src={Victory} alt='victory-emoji' className="h-[100px] "></img>
                </div>
                <p className="font-medium text-center">
                    Fill in the detail to get started with the best Chat App!
                </p>
            </div> 
            <div className="flex items-center justify-center w-full">
                <Tabs className="w-3/4" defaultValue="login">
                    <TabsList className="bg-transparent rounded-none w-full flex">
                        <TabsTrigger value="login" className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300">Login</TabsTrigger>
                        <TabsTrigger value="signup"  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300">Signup</TabsTrigger>
                    </TabsList>
                    <TabsContent className="flex flex-col gap-7 mt-10" value="login">
                        <Input placeholder='email' type='email' className="rounded-full p-6" value={email} onChange={e=>setEmail(e.target.value)}></Input>

                        <Input placeholder='password' type='password' className="rounded-full p-6" value={password} onChange={e=>setPassword(e.target.value)}></Input>

                        <Button className="rounded-full p-6" onClick={handlelogin}>Login</Button>
                         
                    </TabsContent>
                    <TabsContent className="flex flex-col gap-5" value="signup">
                        <Input placeholder='email' type='email' className="rounded-full p-6" value={email} onChange={e=>setEmail(e.target.value)}></Input>

                        <Input placeholder='password' type='password' className="rounded-full p-6" value={password} onChange={e=>setPassword(e.target.value)}></Input>

                        <Input placeholder='confirmpassword' type='password' className="rounded-full p-6" value={confirmpassword} onChange={e=>setConfirmPassword(e.target.value)}></Input>

                        <Button className="rounded-full p-6" onClick={handlesignup}>Signup</Button>

                    </TabsContent>
                </Tabs>
            </div>
            </div>
        </div>
    </div>
  )
}

export default Auth