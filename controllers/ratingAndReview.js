const RatingAndReview=require('../models/RatingAndReview');
const Course=require('../models/Course');
const { default: mongoose } = require('mongoose');

//createRating
exports.createRating= async (req,res) =>{
    try{
        //get user id
        const userId=req.user.id;

        //fetch data from request body
        const {rating,review,courseId}=req.body;

        //check if user is enrolled or not
        const courseDetails=await Course.findOne({_id:courseId},
            {studentsEnrolled:{$elemMatch: {$eq: userId}}}
        )

        if(!courseDetails)
        {
            return res.status(404).json({
                success:false,
                message:"Student is not enrolled in the course"
            })
        }

        //check if user already reviewd or not
        const alreadyReviewed=await RatingAndReview.findOne({  
            user:userId,
            course:courseId
        });

        if(alreadyReviewed)
        {
            return res.status(404).json({
                success:false,
                message:"Student is not enrolled in the course"
            })
        }

        //craete rating and review
        const ratingAndReview=await RatingAndReview.create({rating,review,course:courseId,user:userId});

        //update course with rating and review
        await Course.findByIdAndUpdate({_id:courseId},
            {$push:{
                ratingAndReviews:ratingAndReview.id
            }},
            {new:true}
        );

        //return response
        return res.status(200).json({
            success:false,
            message:"Rating and review created sucessfully"
        })
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}



//get averageRating
exports.getAverageRating= async (req,res)=>{
    try{
        const {courseId}=req.body;

        const result=await RatingAndReview.aggregate([
            {
                $match:{
                    course:new mongoose.Schema.Types.ObjectId(courseId),
                }
            },
            {
                $group:{
                    _id:null,
                    averageRating: {$avg:"$rating"}
                }
            }
            
        ])

        if(result.length>0)
        {
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating
            })
        }

        //if no rating/review exists
        return res.status(200).json({
            success:true,
            message:"Average rating is 0, no ratings given till now",
            averageRating:0
        })
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


//getAllRatingAndReviews

exports.getAllRating= async (req,res)=>{
    try{
        const allReviews=await RatingAndReview.find({})
                            .sort({rating:"desc"})
                            .populate({
                                path:"user",
                                select:"firstNamr lastName email image"
                            })
                            .populate({
                                path:"course",
                                select:"courseName",
                            })
                            .exec();

        return res.status(200).json({
            success:true,
            message:"all reviews searched successfully",
            data:allReviews
        })
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}