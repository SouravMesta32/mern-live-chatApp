import Message from "../models/MessagesModel.js";
import {mkdirSync, renameSync} from "fs"
import cloudinary from "../couldinaryconfig.js";
import streamifier from "streamifier"


export const getMessages  = async (request,response,next)=>
{
    try{
        
        const user1 = request.userId;
        const user2 = request.body.id;
          
        if(!user1 || !user2){
            return response.status(400).send("Both user Id's are  is required")

        }

        
        const messages = await Message.find({
            $or:[
                {sender:user1,recipient:user2},{sender:user2,recipient:user1}
            ]
        }).sort({timeStamp:1})

        return response.status(200).json({messages})
 
    }catch(error){
        console.log({error})
        return response.status(500).send("Internal server Error")
    }
}

export const uploadFiles  = async (request,response,next)=>
{
    try{
        if(!request.file )
        {
            return response.status(400).send("File is required")
        }



        const stream = streamifier.createReadStream(request.file.buffer)
        const originalFilename = request.file.originalname
        const fileExtension = originalFilename.split('.').pop()
        const mimeType = request.file.mimetype
        let resourceType = 'raw'
        if (mimeType.startsWith("image/")) {
            resourceType = "image";
          } else if (mimeType.startsWith("video/")) {
            resourceType = "video";
          }


        const uploadPromise = new Promise((resolve,reject)=>{
            const uploadStream = cloudinary.v2.uploader.upload_stream(
                {folder:"files",
                resource_type:resourceType,
                upload_preset: "file_upload",
                use_filename: true,
                unique_filename: false,
                public_id: originalFilename,
                access_mode:'public'
            },
                (error,result)=>{
                    if(error){
                        console.log({error})
                        console.log("Cloudinary upload error:", error); 
                        return reject("internal server error")
                    }
                    console.log("Cloudinary upload success:", result); 
    
                    if (result) {
                        resolve(result.secure_url); // Proceed only if result is valid
                    } else {
                        reject("No result from Cloudinary");
                    }
                }
    
            )
            

            stream.pipe(uploadStream)
        });

        const filePath = await uploadPromise

        
        
        
        // const date = Date.now();

        // let fileDir = `uploads/files/${date}`
        // let fileName = `${fileDir}/${request.file.originalname}`;

        // mkdirSync(fileDir,{recursive:true});

        // renameSync(request.file.path, fileName)

         return response.status(200).json({filePath})
 
    }catch(error){
        console.log({error})
        return response.status(500).send("Internal server Error")
    }
}