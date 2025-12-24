const OTP=require('../models/OTP');
const User=require('../models/User');
const Profile=require('../models/Profile');

const otpGenerator=require('otp-generator');

const bcrypt=require('bcrypt');

const jwt=require('jsonwebtoken');

require('dotenv').config();

const mailSender=require('../utils/mailSender');


//sendOTP
exports.sendOTP = async (req, res) => {
  try {
    let { email } = req.body;
    email = email.toLowerCase().trim();

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already registered",
      });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    await OTP.deleteMany({ email });
    await OTP.create({ email, otp }); 



    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



//Sign Up
exports.signUp = async (req, res) => {
  try {
    let {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      otp,
    } = req.body;

    email = email.toLowerCase().trim();

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const otpDoc = await OTP.findOne({ email }).sort({ createdAt: -1 });

    if (!otpDoc) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    // expiry check
    const age = Date.now() - otpDoc.updatedAt.getTime();
    if (age > 5 * 60 * 1000) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (otp !== otpDoc.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const profile = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      additionalDetails: profile._id,
      image: `https://api.dicebear.com/9.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    await OTP.deleteOne({ email });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



//Login
exports.login= async (req,res)=>{
    try{
        //get data from req body
        const {email,password}=req.body;
        //validation data
        if(!email || !password)
        {
            return res.status(400).json({
                success:false,
                message:"All fields are required,please try again"
            });
        }
        //user check exist or not
        const user=await User.findOne({email});
        if(!user)
        {
            return res.status(401).json({
                success:false,
                message:"User is not registered"
            });
        }
        //generate jwt, after password matching
        if(await bcrypt.compare(password,user.password))
        {
            const payload={
                email:user.email,
                id:user._id,
                role:user.accountType
            }
            const token=jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h"
            });

            user.token=token;
            user.password=undefined;

            //create cookie and send response
            const options={
                expires: new Date(Date.now()+3*24*60*60*1000),
                httpOnly:true
            }
            
            //.cookie("token",token,options).
            res.status(200).json
            ({
                success:true,
                token,
                user,
                message:'Logged in successfully',
            })
        }

        else{
            return res.status(500).json({
                success:false,
                message:"Password incorrect"
            });
        }

    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Login failure, please try again"
        });
    }
}


//Change Password

exports.changePassword= async (req,res) =>{
    try{
        //get data from req body
        //get oldPassword, newPassword, confirmNewPassword
        const {email,oldPassword,newPassword,confirmNewPassword}=req.body;

        //validation
        if(!email || !oldPassword || !newPassword || !confirmNewPassword)
        {
            return res.status(400).json({
                success:false,
                message:"Please fill up all the fields"
            });
        }

        if(newPassword !== confirmNewPassword)
        {
            return res.status(400).json({
                success:false,
                message:"Confirmed Password does not match with new password"
            });
        }

        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }

        //compare old password
        if(!(await bcrypt.compare(oldPassword,user.password)))
        {
            return res.status(400).json({
                success: false,
                message: "Invalid old password",
            });
        }

        const hashedPassword=await bcrypt.hash(newPassword,10);
        //update password in DB
        await User.findOneAndUpdate({email},{ password:hashedPassword });

        //send mail - Password updated
        try{
            const mailResponse= await mailSender(email,"Password Modification","Password changed successfully");
            console.log("Email sent successfully",mailResponse);
        }
        catch(error)
        {
            console.log("error occured while sending the password change confirmation mail", error);
            throw error;
        }
        //return response

        return res.status(200).json({
            success:true,
            message:"Password changed successfully"
        })
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Password Updation failed, please try again"
        });
    }
}

/* 
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImN1cHdvcmxkMjU4QGdtYWlsLmNvbSIsImlkIjoiNjk0NDVjYjNkMTU3ZmZjYjM4OGI4OWRmIiwicm9sZSI6IlN0dWRlbnQiLCJpYXQiOjE3NjYwOTEzMjAsImV4cCI6MTc2NjA5ODUyMH0._i5YHq89XnIMYtOZogtyHfbOPEdem4wcJdWO0iG13VQ

*/

/*
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJpdGFicmF0YW0xNTA0MjAwNUBnbWFpbC5jb20iLCJpZCI6IjY5NDQ1ZDQ2ZDE1N2ZmY2IzODhiODllNSIsInJvbGUiOiJTdHVkZW50IiwiaWF0IjoxNzY2MDkxNDMzLCJleHAiOjE3NjYwOTg2MzN9.4ObOz42-2HIMXwZt-c-ArATuo1p-pvKqkpdKOaqqj0s
*/