const SubSection=require("../models/SubSection");
const Section=require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");


//create subsection
exports.createSubSection = async (req,res)=>{
    try{
        //fetch data from Req body
        const {sectionId,title,timeDuration,description}=req.body;

        //extract file/video
        const video= req.files?.videoFile;

        //validation
        if(!sectionId || !title || !timeDuration || !description)
        {
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });
        }
        //upload video to cloudinary
        const uploadDetails= await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
        //create a subsection
        const subSectionDetails = await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url
        });
        //update section with this subsection ObjectId
        const updatedSection= await Section.findByIdAndUpdate(sectionId,
                                                                {
                                                                    $push:{
                                                                        SubSection:subSectionDetails._id
                                                                    }
                                                                },
                                                                {new:true}
        )
        .populate("SubSection")
        .exec();
        //return response
        return res.status(200).json({
            success:true,
            message:"Sub-section created successfully"
        });

    }
    catch(error)
    {
        return res.status(500).json({
            success:false,
            message:"Internal server error",
            error:error.message
        });
    }
    
}

//HW : update sub-section
exports.updateSubSection=async (req,res)=>{
    try{
        const { sectionId, title, description } = req.body
        const subSection = await SubSection.findById(sectionId)
  
        if (!subSection) {
            return res.status(404).json({
            success: false,
            message: "SubSection not found",
            })
        }
    
        if (title !== undefined) {
            subSection.title = title
        }
    
        if (description !== undefined) {
            subSection.description = description
        }
        if (req.files && req.files.video !== undefined) {
            const video = req.files.video
            const uploadDetails = await uploadImageToCloudinary(
            video,
            process.env.FOLDER_NAME
            )
            subSection.videoUrl = uploadDetails.secure_url
            subSection.timeDuration = `${uploadDetails.duration}`
        }
    
        await subSection.save()
    
        return res.json({
            success: true,
            message: "Section updated successfully",
        })
        
    }
    catch(error)
    {
        return res.status(500).json({
            success:false,
            message:"Internal server error",
            error:error.message
        });
    }
}

//delete sub-section
exports.deleteSubSection=async (req,res)=>{
    try{
        const{subSectionId}=req.params;

        await Section.findOneAndUpdate(
            { SubSection: subSectionId },
            { $pull: { SubSection: subSectionId } }
        );
        
        await SubSection.findByIdAndDelete(subSectionId);


        
        return res.status(200).json({
            success:true,
            message:"Sub Section deleted successfully"
        });

        
    }
    catch(error)
    {
        return res.status(500).json({
            success:false,
            message:"Internal server error",
            error:error.message
        });
    }
}