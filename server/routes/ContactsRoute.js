import {Router} from "express";
import { searchContacts } from "../controllers/ContactsController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const ContactRoute = Router();

ContactRoute.post("/search",verifyToken,searchContacts)

export default ContactRoute