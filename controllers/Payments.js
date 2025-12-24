const {instance}=require("../config/razorpay");
const { default: mongoose } = require("mongoose");
const Course=require("../models/Course");
const User=require("../models/User");

const mailSender=require("../utils/mailSender");
const {courseEnrollmentEmail}=require("../mail/templates/courseEnrollmentEmail");


//capture the payment and initiate the Razorpay order
exports.capturePayment= async (req,res)=>{
    //get courseId and UserID 
    const {course_id}=req.body;
    const userId=req.user.id;
    //validation

    if(!course_id)
    {
        return res.json({
            success:false,
            message:"Please provide valid course Id"
        });
    }

    //valid courseDetail
    let course;
    try{
        course=await Course.findById(course_id);
        if(!course)
        {
            return res.json({
                success:false,
                message:"could not find the course"
            });
        }

        //user already paid for the same course or not
        const uid = new mongoose.Types.ObjectId(userId);//conversion from string to object id

        //check student already enrolled in the course or not
        if(course.studentsEnrolled.includes(uid)) {
            return res.status(200).json({
                success:false,
                message:'Student is already enrolled',
            });
        }

    }
    catch(error)
    {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
    
    //create order
    const amount= course.price;
    const currency="INR";

    const options={
        amount:amount*100,
        currency,
        receipt:Math.random(Date.now()).toString(),
        notes:{
            courseId:course_id,
            userId
        }
    };

    try{
        //initiating the payment using Razorpay
        //create order
        const paymentResponse= await instance.orders.create(options);
        console.log(paymentResponse);
        //return response
        return res.status(200).json({
            success:true,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            thumbnail: course.thumbnail,
            orderId: paymentResponse.id,
            currency:paymentResponse.currency,
            amount:paymentResponse.amount,
        })
    }
    catch(error)
    {
        console.log(error);
        res.json({
            success:false,
            message:"Could not initiate order"
        });
    }

}

//verify Signature of Razorpay and Server

exports.verifySignature= async(req,res)=>{
    const webhookSecret="12345678";//signature stored in Backend


    const signature=req.headers["x-razorpay-signature"];


    //hmac needs hashing algo and secret key
    const shasum=crypto.createHmac("sha256",webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest=shasum.digest("hex");

    //compare both the signature
    if(signature === digest)
    {
        console.log("Paymet is authorized");

        const {courseId,userId}=req.body.payload.payment.entity.notes;

        try{
            //fulfill the action

            //find the course and enroll the student in it
            const enrolledCourse=await Course.findOneAndUpdate({_id:courseId},
                                                            {$push:{studentsEnrolled:userId}},
                                                            {new:true}
                                                        );

            console.log(enrolledCourse);

            if(!enrolledCourse)
            {
                return res.status(500).json({
                    success:false,
                    message:"Course not found"
                })
            }

            //find the student and add the couse to their list of enrolled courses
            const enrolledStudent=await User.findOneAndUpdate(
                {_id:userId},
                {$push:{courses:courseId}},
                {new:true}
            );

            console.log(enrolledStudent);

            //send confirmation mail
            const emailResponse= await mailSender(
                enrolledStudent.email,"Congratulations from Codehelp","Congratulations , you have enrolled in the course"
            );

            console.log(emailResponse);

            return res.status(200).json({
                success:false,
                message:"Signature verified and course added"
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

    else{
         return res.status(400).json({
            success:false,
            message:`Invalid request`
        })
    }

    
}