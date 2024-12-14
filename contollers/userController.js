import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

/// API to register userSelect:

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !password || !email) {
      return res.json({ success: false, message: "Missing details" });
    }

    //validating email
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Wrong email" });
    }

    // Vlaidating strong password
    if (password.length < 8) {
      return res.json({ success: false, message: "Enter a strong password" });
    }
    // Check if the email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "Email already registered" });
    }

    // Hashing user password
    const salt = await bcrypt.genSalt(10);
    const hasedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hasedPassword,
    };

    // Saving new user into database
    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.mmessage });
  }
};

// API for user login

const loginUser = async (req, res) => {
  try {
    const {email,password} = req.body
    const user = await userModel.findOne({email})
    if(!user){
        return res.json({ success: false, message:'User doenot exists'});
    } 
    const isMatch = await bcrypt.compare(password,user.password)

    if(isMatch){
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
        return res.json({success:true,token})
    }
    else{
        res.json({succes:false,message:"Invalid data"})
    }
    

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.mmessage });
  }
};

export { registerUser,loginUser };
