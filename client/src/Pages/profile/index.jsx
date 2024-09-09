import { useAppStore } from "@/store/index"
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useState } from "react";
import { colors, getColors } from "@/lib/utils";
import {FaPlus,FaTrash} from "react-icons/fa"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Profile = () => {
    const navigate = useNavigate();
    const {userInfo , setUserInfo} = useAppStore();
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [image, setImage] = useState(null)
    const [hovered, setHovered] = useState(false)
    const [color, setColor] = useState(0)

    const saveChanges = async ()=>{

    }

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10 ">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div >
          <IoArrowBack className="text-4xl lg:text-5xl text-white/90 cursor-pointer"></IoArrowBack>
        </div>
        <div className="grid grid-cols-2"> 
          <div className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center "
          onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}>
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">{
              image ? (<AvatarImage src={image} alt='profile' className="object-cover w-full h-full bg-black"/>) : (
              <div className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColors(color)}`}>
              {firstname ? firstname.split("").shift() : userInfo.email.split("").shift()}
              </div>)
            }
            </Avatar>
            {
              hovered && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full" >
                  {
                    image ? <FaTrash className="text-white text-3xl cursor-pointer"/> : <FaPlus className="text-white text-3xl cursor-pointer "/>
                  }
                </div>
              )
            }
            {/* <input type="text"></input> */}
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
             <div className="w-full ">
              <Input placeholder="Email" type="email" disable value={userInfo.email} className="rounded-lg p-6 bg-[#2c2e3b] border-none"></Input>
             </div>
             <div className="w-full ">
              <Input placeholder="First Name" type="text"  value={firstname} onChange={e=>{
                setFirstname(e.target.value)
              }}   className="rounded-lg p-6 bg-[#2c2e3b] border-none"></Input>
             </div>
             <div className="w-full ">
              <Input placeholder="Last Name" type="text"  value={lastname} onChange={e=>{
                setLastname(e.target.value)
              }} className="rounded-lg p-6 bg-[#2c2e3b] border-none"></Input>
             </div>
             <div className="w-full flex gap-5 ">
              {
                colors.map((color1,index)=><div className={`${color1} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${color===index ? "outline outline-white/50 outline-4":""}`} key={index} onClick={()=>setColor(index)} ></div>)
              }
             </div>
          </div>
        </div>
        <div className="w-full">
          <Button className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300" onClick={saveChanges}>Save Changes</Button>
        </div>
      </div>
    </div>
  )
}

export default Profile