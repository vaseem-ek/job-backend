import job from "../models/job.js"



//get alll jobs
export const getJobs = async (req, res) => {
    try {
        const jobs=await job.find({visible:true})
        .populate({path:'companyId',select:'-password'})
       return res.json({success:true,jobs})

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

// get a single job
export const getJobById = async (req, res) => {
    try {
        const {id}=req.params
        const singleJob=await job.findById(id)
        .populate({path:"companyId",select:'-password'})
        if(!singleJob){
            return res.json({success:false,message:"job not fount"})
        }
       return res.json({success:true,singleJob})

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


