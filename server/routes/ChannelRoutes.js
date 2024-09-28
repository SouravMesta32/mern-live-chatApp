import {Router} from "express"
import { createChannel } from "../controllers/ChannelControllers.js"
import { verifyToken } from "../middlewares/AuthMiddleware.js"
const channelRoute = Router()

channelRoute.post("/create-channel",verifyToken,createChannel)

export default channelRoute