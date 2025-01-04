import doctorModel from "../models/doctormodel.js"
import bcrypt from 'bcrypt'
import Jwt from 'jsonwebtoken'
// import { message } from "prompt"

// API for Doctor Login


const loginDoctor = async(req,res)=>{

    try{
        const {email,password} = req.body
        const doctor = await doctorModel.findOne({email})
        if(!doctor){
            return res.json({success:false,message:"Invalid Email and Password"})
        }

        const isMatch = await bcrypt.compare(password,doctor.password)

        if(isMatch){
            const token = Jwt.sign({id:doctor._id},process.env.JWT_SECRET)
            res.json({success:true,token})
        }else{
            res.json({success:false,message:"Invalid Email and Password"})
        }

    }
    catch(error){
        console.log(error)
        res.json({success:false, message:error,message})
    }

}
export {loginDoctor}



// Changing availability

 const changeAvailablity = async (req, res) => {
    try {
      const { docId } = req.body;
  
      const docData = await doctorModel.findById(docId);
      await doctorModel.findByIdAndUpdate(docId,{available:!docData.available})
      res.json({ success: true, message: "Availability updated successfully" });

    } catch (error) {
      console.error(error);
      res.json({ success: false, message: "Internal server error" });
    }
  };
  

export {changeAvailablity}


// Doctor list 

const doctorList = async(req,res)=>{
  try{
    const doctors = await doctorModel.find({}).select(['-password,-email'])
    res.json({success:true, doctors})
  }catch(error){
    console.error(error);
      res.json({ success: false, message:error,message });
    
  }
}
export {doctorList}