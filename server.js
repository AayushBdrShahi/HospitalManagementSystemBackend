import  express  from "express";
import cors from 'cors';
import 'dotenv/config'
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import userRouter from "./routes/userRouter.js";

//app config
const app =  express()
const PORT = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(cors())
app.use(express.json());

//Routes
app.use ('/api/admin',adminRouter);
app.use('/api/user',userRouter);

app.get('/',(req,res)=>{
    res.send("It is working");
})

//api endpoints
app.get('/',(req,res) =>{
    res.send("API WORKING")
})

//Start the server
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT} `);
})
