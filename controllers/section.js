const Section=require("../models/Section");
const Course=require("../models/Course");
const SubSection=require("../models/SubSection");

exports.createSection=async(req,res)=>{
    try{
        //fetch data
        const {sectionName, courseId}=req.body;
        //data validation
        if(!sectionName || !courseId)
        {
            return res.status(400).json({
                success:false,
                message:'Missing properties'
            });
        }
        //create section
        const newSection= await Section.create({sectionName});
        //update section Id in course
        const updatedCourseDetails=await Course.findByIdAndUpdate(courseId,
                                                            {
                                                                $push:{
                                                                    courseContent:newSection._id
                                                                }
                                                            },
                                                        {new:true}  ).populate({
                                                                        path: 'courseContent',
                                                                        populate: {
                                                                            path: 'SubSection',
                                                                        },
                                                            }).exec();
        //return response
        return res.status(200).json({
            success:true,
            message:"Section created successfully",
            updatedCourseDetails
        });
    }
    catch(error)
    {
        return res.status(400).json({
            success:false,
            message:'Unable to create section, please try again',
            error:error.message
        });
    }
}

exports.updateSection= async (req,res)=>{
    try{
        //data input
        const {sectionName, sectionId}=req.body;
        //data validation
        if(!sectionName || !sectionId)
        {
            return res.status(400).json({
                success:false,
                message:'Missing properties'
            });
        }
        //update
        const sectionDetails= await Section.findByIdAndUpdate(sectionId,{sectionName:sectionName},{new:true});

        const updatedCourseDetails = await Course.findOne({ courseContent: sectionId })
        .populate({
            path: "courseContent",
            populate: { path: "SubSection" },
        })
        .exec();

        //return response
        return res.status(200).json({
            success:true,
            message:"Section updated successfully",
            updatedCourseDetails
        });
    }
    catch(error)
    {
        return res.status(500).json({
            success:false,
            message:'Unable to update section, please try again',
            error:error.message
        });
    }
}

exports.deleteSection= async (req,res)=>{
    try{
        //get Id-assuming that we are sending id in params
        const {sectionId}=req.body;
        
        const section = await Section.findById(sectionId);
        if (!section) {
            return res.status(404).json({
                success: false,
                message: "Section not found"
            });
        }

        // Delete all subsections under this section
        await SubSection.deleteMany({ _id: { $in: section.SubSection } });

        // Delete the section itself
        await Section.findByIdAndDelete(sectionId);

        //Todo[testing]: do we need to delete the entry from course schema??
        await Course.findOneAndUpdate({courseContent: sectionId},{
                                                                $pull:{
                                                                   courseContent: sectionId 
                                                                }
                                                            })
        //return response
        return res.status(200).json({
            success:true,
            message:"Section deleted successfully",
        });
    }
    catch(error)
    {
        return res.status(500).json({
            success:false,
            message:'Unable to delete section, please try again',
            error:error.message
        });
    }
}