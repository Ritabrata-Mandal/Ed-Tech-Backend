const mongoose=require('mongoose');
const mailSender = require('../utils/mailSender');
const otpTemplate=require('../mail/templates/emailVerificationTemplate');

const OTPSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        index: true,
    },
    otp:{
        type:String,
        required:true,
    },
},
{ timestamps: true }
);

//NOTE:
//when you are adding middleware (be it pre or post) you must add it after defining the schema and before exporting model


//a function  ->to send email

async function sendVerificationEmail(email,otp)
{
    try{
        const mailResponse= await mailSender(email,"Verification email from studyNotion",otpTemplate(otp));
        console.log("Email sent successfully",mailResponse);
    }
    catch(error)
    {
        console.log("error occured while sending the mail", error);
        throw error;
    }
}

OTPSchema.pre("save", async function(next){
    await sendVerificationEmail(this.email,this.otp);
    next();
})




module.exports=mongoose.model("OTP",OTPSchema);