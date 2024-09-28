import mongoose from "mongoose"
import User from "../models/UserModel.js"
import Channel from "../models/ChannelModel.js"


export const createChannel = async (request,response,next)=>
{
    try{

       const {name,members} = request.body
       const userId = request.userId

       const admin = await User.findById(userId)

       if(!admin){
        return response.status(400).send("Admin user not found")
       }

       const validMember = await User.find({_id:{$in:members}})

       if(validMember.length !== members.length){
        return response.status(400).send("Some members are not valid users");
       }

       const newChannel = new Channel(
        {name,members,admin:userId}
       )

       await newChannel.save()

        return response.status(201).json({channel:newChannel})
 
    }catch(error){
        console.log({error})
        return response.status(500).send("Internal server Error")
    }
}

export const getUserChannel = async (request,response,next)=>
{
    try{

       const userId = new mongoose.Types.ObjectId(request.userId)
       const channels = await Channel.find({
        $or:[{admin:userId},{members:userId}]
        }).sort({updatedAt:-1})
       
      

       return response.status(201).json({channels})
 
    }catch(error){
        console.log({error})
        return response.status(500).send("Internal server Error")
    }
}


