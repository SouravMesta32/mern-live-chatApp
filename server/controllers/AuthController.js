import User from "../models/UserModel.js";
import jwt  from "jsonwebtoken"
import { compare } from "bcrypt";


const maxAge = 3 * 24 * 60 * 60 * 1000;
const createtoken = (email,usedId)=>{
    return jwt.sign({email,usedId},process.env.JWT_KEY,{expiresIn:maxAge})
}

export const signup = async (request,response,next)=>
{
    try{
        const {email,password}=request.body;
        if(!email || !password)
        {
             return response.status(400).send("Email and Password is required");
        }

        const user = await User.create({email,password});
        response.cookie("jwt",createtoken(email,user.id),{
            maxAge,
            secure:true,
            sameSite:"None"
        });
        
        return response.status(201).json({
            user:{
                id:user.id,
                email:user.email,
                profilesetup:user.profilesetup
            }
        })

    }catch(error){
        console.log({error})
        return response.status(500).send("Internal server Error")
    }
}

export const login = async (request,response,next)=>
{
    try{
        const {email,password}=request.body;
        if(!email || !password)
        {
             return response.status(400).send("Email and Password is required");
        }

        const user = await User.findOne({email});
        if(!user){
            return response.status(400).send("User with the given email not found")
        }

        const auth = await compare(password,user.password)
        if(!auth)
        {
            return response.status(400).send("Wrong Password")
        }
        response.cookie("jwt",createtoken(email,user.id),{
            maxAge,
            secure:true,
            sameSite:"None"
        });
        
        return response.status(200).json({
            user:{
                id:user.id,
                email:user.email,
                profilesetup:user.profilesetup,
                firstname:user.firstname,
                lastname:user.lastname,
                image:user.image,
                color:user.color 
            }
        })

    }catch(error){
        console.log({error})
        return response.status(500).send("Internal server Error")
    }
}

export const getUserInfo = async (request,response,next)=>
{
    try{

        const userdata = await User.findById(request.userId);
        if(!userdata){
            return response.status(404).send('The given user not found')
        }
        // console.log("hi")
        // console.log(request.userId);
       
        return response.status(200).json({
            
                id:userdata.id,
                email:userdata.email,
                profilesetup:userdata.profilesetup,
                firstname:userdata.firstname,
                lastname:userdata.lastname,
                image:userdata.image,
                color:userdata.color 
            
        })
 
    }catch(error){
        console.log({error})
        return response.status(500).send("Internal server Error")
    }
}


export const updateProfile = async (request,response,next)=>
{
    try{

        const {userId} = request;
        const {firstname,lastname,color}=request.body;

        if(!firstname || !lastname || color===undefined){
            return response.status(400).send('Firstname and Lastname are required')
        }
        // console.log("hi")
        // console.log(request.userId);
       
        const userdata = await User.findByIdAndUpdate(userId,{firstname,lastname,color,profilesetup:true},{new:true,runValidators:true})
        return response.status(200).json({
            
                id:userdata.id,
                email:userdata.email,
                profilesetup:userdata.profilesetup,
                firstname:userdata.firstname,
                lastname:userdata.lastname,
                image:userdata.image,
                color:userdata.color 
            
        })
 
    }catch(error){
        console.log({error})
        return response.status(500).send("Internal server Error")
    }
}