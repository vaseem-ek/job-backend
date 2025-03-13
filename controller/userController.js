import job from "../models/job.js"
import JobApplication from "../models/jobApplications.js"
import user from "../models/user.js"
import { v2 as cloudinary } from "cloudinary"



//get user data
export const getUserData=async(req,res)=>{
    try {
        const userId=req.auth.userId
        const users=await user.findById(userId)
        if(!users){
            return res.json({success:false,message:'user not found'})

        }
        return res.json({success:true,users})

    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}

//apply for job
export const applyForJob=async(req,res)=>{
    try {
        const {jobId}=req.body
        //user id get form clerk
        const userId=req.auth.userId

        const isAlreadyApplied=await JobApplication.find({jobId,userId})
        if(isAlreadyApplied.length>0){
            return res.json({success:false,message:"Already applied"})
        }
        const jobData=await job.findById(jobId)
        if(!jobData){
            return res.json({success:false,message:"job not found"})
        }

        await JobApplication.create({
            companyId:jobData.companyId,
            userId,
            jobId,
            date:Date.now()
        })
        return res.json({success:true,message:"applied successfully"})

    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}

//get user job applications
export const getUserJobApplication=async(req,res)=>{
    try {
        const userId=req.auth.userId
        const application=await JobApplication.find(userId)
        .populate('companyId','name email image')
        .populate('jobId','title description location category level salary')
        .exec()

        if(!application){
            return res.json({success:false,message:"no job application found"})
        }
        return res.json({success:true,application})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}

//update  user resume or upload
export const updateResume=async(req,res)=>{
    try {
        const userId=req.auth.userId
        const resumeFile=req.file
        const userData=await user.findById(userId)
        if(resumeFile){
            const resumeUpload=await cloudinary.uploader.upload(resumeFile.path)
            userData.resume=resumeUpload.secure_url
        }
        await userData.save()
        return res.json({success:true,message:"rersume Updated"})
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}

