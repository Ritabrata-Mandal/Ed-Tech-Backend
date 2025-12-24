const jwt=require('jsonwebtoken');
require('dotenv').config();
const User=require('../models/User');

//auth
exports.auth= async (req, res, next)=>{
    try{
        //extract token           req.cookies.token || 
        const token= req.body.token || req.header("Authorization").replace("Bearer ","");//be careful there is a space after 'Bearer'
        //if token missing , return response 
        if(!token)
        {
            return res.status(401).json({
                success:false,
                message:'Token missing'
            });
        }


        //verify the token 
        try{
            const decode=await jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);

            //user object created inside request
            req.user=decode;
        }
        catch(error)
        {
            return res.status(400).json({
                success:false,
                message:"Token is invalid"
            });
        }

        next();

    }
    catch(error)
    {
        return res.status(400).json({
            success:false,
            message:"Something went wrong while validating the token"
        });
    }
}
//isStudent

exports.isStudent= async (req,res,next)=>{
    try{
        if(req.user.role !== "Student")
        {
            return res.status(400).json({
                success:false,
                message:"Protected route for Student"
            });
        }
        next();
    }
    catch(error)
    {
        return res.status(400).json({
            success:false,
            message:"Something went wrong"
        });
    }
}

//is isInstructor
exports.isInstructor= async (req,res,next)=>{
    try{
        if(req.user.role !== "Instructor")
        {
            return res.status(400).json({
                success:false,
                message:"Protected route for Instructor"
            });
        }
        next();
    }
    catch(error)
    {
        return res.status(400).json({
            success:false,
            message:"Something went wrong"
        });
    }
}


//isAdmin
exports.isAdmin= async (req,res,next)=>{
    try{
        if(req.user.role !== "Admin")
        {
            return res.status(400).json({
                success:false,
                message:"Protected route for Admin"
            });
        }
        next();
    }
    catch(error)
    {
        return res.status(400).json({
            success:false,
            message:"Something went wrong"
        });
    }
}