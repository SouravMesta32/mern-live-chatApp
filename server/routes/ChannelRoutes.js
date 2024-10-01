import {Router} from "express"
import { createChannel, getChannelMessages, getUserChannel } from "../controllers/ChannelControllers.js"
import { verifyToken } from "../middlewares/AuthMiddleware.js"
const channelRoute = Router()

channelRoute.post("/create-channel",verifyToken,createChannel)
channelRoute.get("/get-user-channels",verifyToken,getUserChannel)
channelRoute.get("/get-channel-messages/:channelId",verifyToken,getChannelMessages)

export default channelRoute