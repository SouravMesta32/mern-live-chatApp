import mongoose from "mongoose";
import Message from "../models/MessagesModel.js";
import User from "../models/UserModel.js";

export const searchContacts  = async (request,response,next)=>
{
    try{
        
        const {searchTerm} = request.body;
        if(searchTerm===undefined || searchTerm === null){
            return response.status(400).send("searchTerm is required")

        }

        const sanitizeSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")
        const regex = new RegExp(sanitizeSearchTerm,"i")
        const contacts = await User.find({
            $and:[{
                _id:{$ne:request.userId}
            },{
            $or:[{firstname:regex},{lastname:regex},{email:regex}]
            }
            ],})
            

        return response.status(200).json({contacts})
 
    }catch(error){
        console.log({error})
        return response.status(500).send("Internal server Error")
    }
}

export const getContactsForDmList  = async (request,response,next)=>
{
    try{
        // console.log(request.data)
        
         let {userId} = request
         userId = new mongoose.Types.ObjectId(userId)

         const contacts = await Message.aggregate([{
            $match:{
                $or:[{sender:userId},{recipient:userId}]
            },
         },
         {
            $sort:{timeStamp:-1}
         },
         {
            $group:{
                _id:{
                    $cond:{
                        if:{$eq:["$sender",userId]},
                        then:"$recipient",
                        else:"$sender"
                    }
                },
                lastmessageTime:{$first:"$timeStamp"} 
            },
            
         },
         {
            $lookup:{
                from:"users",
                localField:"_id",
                foreignField:"_id",
                as:"contactInfo"
            }
         },{
            $unwind:"$contactInfo",
         },{
            $project:{
                _id:1,
                lastmessageTime:1,
                email:"$contactInfo.email",
                firstname:"$contactInfo.firstname",
                lastname:"$contactInfo.lastname",
                color:"$contactInfo.color",
                image:"$contactInfo.image"
            }

         },{
            $sort:{lastmessageTime:-1}
         }
        
        ])

        console.log(contacts)

        return response.status(200).json({contacts})
 
    }catch(error){
        console.log({error})
        return response.status(500).send("Internal server Error")
    }
}

export const getAllContacts  = async (request,response,next)=>
{
    try{
        
        const users = await User.find({_id:{$ne:request.userId}},"firstname lastname _id email")
        
        const contacts = users.map((users)=>({
            label:users.firstname ? `${users.firstname} ${users.lastname}`: users.email,
            value: users._id
        }))
       

        return response.status(200).json({contacts})
 
    }catch(error){
        console.log({error})
        return response.status(500).send("Internal server Error")
    }
}
