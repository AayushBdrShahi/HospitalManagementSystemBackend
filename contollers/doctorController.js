


// API for Doctor Login

import doctorModel from "../models/doctormodel.js"
import bcrypt from 'bcrypt'
import Jwt from 'jsonwebtoken'

const loginDoctor = async(req,res)=>{

    try{
        const {email,password} = req.body
        const doctor = await doctorModel.findOne({email})
        if(!doctor){
            return res.json({success:false,message:"Invalid Credintals"})
        }

        const isMatch = await bcrypt.compare(password,doctor.password)

        if(isMatch){
            const token = Jwt.sign({id:doctor._id},process.env.JWT_SECRET)
            res.json({success:true,token})
        }else{
            res.json({success:false,message:"Invalid Credintals"})
        }

    }
    catch(error){
        console.log(error)
        res.json({success:false, message:error,message})
    }

}
export {loginDoctor}