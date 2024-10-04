import {Router} from "express"
import { getMessages, uploadFiles } from "../controllers/MessagesController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer"

const messagesRoutes = Router();
const upload = multer({
    dest: "/tmp/uploads/files"
})
messagesRoutes.post("/get-messages",verifyToken, getMessages );
messagesRoutes.post("/upload-file",verifyToken,upload.single("file"),uploadFiles)

export default messagesRoutes