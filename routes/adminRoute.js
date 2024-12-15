import  express  from "express";
import { loginAdmin,addDoctor } from "../contollers/adminController.js";
import upload from '../middlewares/multer.js';
import authadmin from "../middlewares/authadmin.js";


 
const adminRouter = express.Router()
adminRouter.post('/add-doctor', authadmin,upload.single('image'), addDoctor);
adminRouter.post('/login',loginAdmin)


export default adminRouter