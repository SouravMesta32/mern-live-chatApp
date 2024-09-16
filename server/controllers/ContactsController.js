import User from "../models/UserModel.js";

export const searchContacts  = async (request,response,next)=>
{
    try{
        console.log(request.body)
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