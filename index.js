const express=require('express');
const cookieParser=require('cookie-parser');
const cors=require('cors');
const fileUpload=require('express-fileupload');
require('dotenv').config();

const app=express();


//middlewares
app.use(express.json());

app.use(
    cors({
        origin:"http://localhost:3000",
        credentials:true,
    })
)

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

app.use(cookieParser());


const userRoutes=require('./routes/User');
const profileRoutes=require('./routes/Profile');
const paymentRoutes=require('./routes/Payment');
const courseRoutes=require('./routes/Course');

const {connect}=require('./config/database');
const {cloudinaryConnect}=require('./config/cloudinary');

const PORT=process.env.PORT || 4000;

//Db connect
connect();

//cloudinary connect
cloudinaryConnect();

//routes

app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/payment",paymentRoutes);
app.use("/api/v1/course",courseRoutes);

//def route

app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:"Your server is up and running....."
    });
})

app.listen(PORT,()=>{
    console.log(`App is running at ${PORT}`);
});


