import Jwt from "jsonwebtoken";
import message from "prompt";
import  validator  from "validator";
import { v2 as cloudinary } from 'cloudinary';
import bcrypt from 'bcrypt'
import doctorModel from "../models/doctormodel.js";


// API for admin Login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = Jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Email and Password" });
    }
  } catch (error) {
    console.log(error);
    res.json({ succes: false, messgae: error.messgae });
  }
};
export { loginAdmin };


//API for addindg doctor:

const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;

    const imageFile = req.file;

    //checking for all data to add doctor
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.json({ success: false, message: "Missing Details" });
    }

    //Validating email format
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    // validating strong password
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please provide a strong password",
      });
    }
    // Check if doctor with the same email already exists
    const existingDoctor = await doctorModel.findOne({ email });
    if (existingDoctor) {
      return res.json({
        success: false,
        message: "Doctor with this email already exists",
      });
    }

    // hasing doctor password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

     // Upload image to clodinary
     const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageUrl = imageUpload.secure_url;

      let parsedAddress;
try {
  parsedAddress = typeof address === "string" ? JSON.parse(address) : address;
} catch (error) {
  return res.status(400).json({ success: false, message: "Invalid Address Format" });
}

      const doctorData = {
        name,
        email,
        image: imageUrl,
        password: hashedPassword,
        speciality,
        degree,
        experience,
        about,
        fees,
        address: parsedAddress,
        date: Date.now(),
      };
  
      const newDoctor = new doctorModel(doctorData);
      await newDoctor.save();
  
      res.json({ success: true, message: "Doctor Added" });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  };
  
// API to get all doctor list from db for admin panel 

const allDoctors = async(req,res) =>{
  try{

    const doctors = await doctorModel.find({}).select('-password')
    res.json({success:true,doctors})

  }catch(error){
    console.log(error);
    res.json({ succes: false, messgae: error.messgae });
    
  }
}

export { addDoctor, allDoctors };


