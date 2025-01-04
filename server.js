import  express  from "express";
import cors from 'cors';
import 'dotenv/config'
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import userRouter from "./routes/userRouter.js";
import doctorRouter from "./routes/doctorRoute.js";

//app config
const app =  express()
const PORT = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded data


//Routes
app.use ('/api/admin',adminRouter);
app.use('/api/user',userRouter);
app.use('/api/doctor',doctorRouter)

//api endpoints
app.get('/',(req,res) =>{
    res.send("API WORKING")
})

//Start the server
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT} `);
})
