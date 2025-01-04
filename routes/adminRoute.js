import  express  from "express";
import { loginAdmin,addDoctor, allDoctors } from "../contollers/adminController.js";
import upload from '../middlewares/multer.js';
import authadmin from "../middlewares/authadmin.js";
import { changeAvailablity } from "../contollers/doctorController.js";


 
const adminRouter = express.Router()
adminRouter.post('/add-doctor', authadmin,upload.single('image'), addDoctor);
adminRouter.post('/login',loginAdmin)
adminRouter.post('/all-doctors',authadmin,allDoctors)
adminRouter.post('/change-availability',authadmin,changeAvailablity)





export default adminRouter