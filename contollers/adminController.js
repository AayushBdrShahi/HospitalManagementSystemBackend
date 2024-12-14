import Jwt from "jsonwebtoken";
import  message from "prompt";



// API for admin Login

const loginAdmin = async (req,res)=>{

    try{
        const {email,password} = req.body
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = Jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({succes:true,token})
        }else{
            res.json({succes:false,message:"Invalid credentils"})
        }

    }catch(error){
        console.log(error)
        res.json({succes:false, messgae:error.messgae})
    }

}
export {loginAdmin}