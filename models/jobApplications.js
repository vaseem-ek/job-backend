import mongoose from "mongoose";

const jobApplicationSchema=new mongoose.Schema({
    userId:{type:String,ref:'user',required:true},
    companyId:{type:mongoose.Schema.Types.ObjectId,ref:'company',required:true},
    jobId:{type:mongoose.Schema.Types.ObjectId,ref:'job',required:true},
    statud:{type:String,default:"pending"},
    date:{type:Number,required:true}
})

const JobApplication=mongoose.model('JobApplication',jobApplicationSchema)
export default JobApplication