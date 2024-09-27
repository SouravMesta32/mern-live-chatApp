import {Router} from "express";
import { getAllContacts, getContactsForDmList, searchContacts } from "../controllers/ContactsController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const ContactRoute = Router();

ContactRoute.post("/search",verifyToken,searchContacts)
ContactRoute.get("/get-contact-for-dm",verifyToken,getContactsForDmList)
ContactRoute.get("/get-all-contacts",verifyToken,getAllContacts)

export default ContactRoute