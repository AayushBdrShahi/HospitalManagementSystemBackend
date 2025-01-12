import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import {v2 as cloudinary} from 'cloudinary'
import { toast } from "react-toastify";
import doctorModel from "../models/doctormodel.js";
import appointmentModel from "../models/AppointmentModel.js";

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
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User doenot exists" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      return res.json({ success: true, token });
    } else {
      res.json({ succes: false, message: "Invalid User data" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.mmessage });
  }
};

// API to get User Profile data

const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select("-password");

    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.mmessage });
  }
};

// API to update user Profile.

const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone|| !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" });
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    });

    if(imageFile){
      //  uploading image to cloudinary

      const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
      const imageURL = imageUpload.secure_url

     await userModel.findByIdAndUpdate(userId,{image:imageURL})
    }
   res.json({success:true,message:"Profile Updated"})
    
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.mmessage });
  }
};

// Api for book appointment

const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;

    // Fetch doctor data
    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    if (!docData.available) {
      return res.json({ success: false, message: "Doctor not available" });
    }

    let slotsBooked = docData.slots_booked || {};
    if (slotsBooked[slotDate]?.includes(slotTime)) {
      return res.json({ success: false, message: "Slot not available" });
    }
    if (!slotsBooked[slotDate]) {
      slotsBooked[slotDate] = [];
    }
    slotsBooked[slotDate].push(slotTime);

    // Fetch user data
    const userData = await userModel.findById(userId).select("-password");
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    // Create the appointment data
    const appointmentData = {
      userId,
      docId,
      userData,
      docData: {
        name: docData.name,
        speciality: docData.speciality,
        fees: docData.fees,
        experience: docData.experience,
        degree: docData.degree,
        about: docData.about,
        address: docData.address,
        image: docData.image, // Include the image field
      },
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    await doctorModel.findByIdAndUpdate(docId, { slots_booked: slotsBooked });

    res.json({ success: true, message: "Appointment booked successfully!" });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};


 // Api to get user appointments in frontend

 const listAppointments = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await appointmentModel.find({ userId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};




export { registerUser, loginUser, getProfile,updateProfile,bookAppointment,listAppointments };



