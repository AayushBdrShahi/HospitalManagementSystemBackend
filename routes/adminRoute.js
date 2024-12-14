import  express  from "express";
import { loginAdmin } from "../contollers/adminController.js";
import authadmin from "../middlewares/authadmin.js";
 
const adminRouter = express.Router()

adminRouter.post('/login',loginAdmin)

export default adminRouter