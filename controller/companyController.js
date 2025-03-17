import company from "../models/company.js";
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from "cloudinary";
import generateToken from "../utils/generateToken.js";
import job from "../models/job.js";
import JobApplication from "../models/jobApplications.js";

//register a new company

export const registerCompany = async (req, res) => {

    const { name, email, password } = req.body
    const imageFile = req.file
    if (!name || !email || !password || !imageFile) {
        return res.json({ success: false, message: "missing details" })
    }
    try {
        const existingComapany = await company.findOne({ email })
        if (existingComapany) {
            return res.json({ success: false, message: "company already registered" })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const imageUpload = await cloudinary.uploader.upload(imageFile.path)

        const newCompany = new company({
            name,
            email,
            image: imageUpload.secure_url,
            password: hashedPassword
        })
        await newCompany.save()
        return res.json({ success: true, newCompany, token: generateToken(newCompany._id) })


    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

//login company
export const loginCompany = async (req, res) => {
    try {
        const { email, password } = req.body
        const existing = await company.findOne({ email })
        if (!existing) {
            return res.json({ success: false, message: "invalid email" })
        }
        const isMatch = await bcrypt.compare(password, existing.password)
        if (isMatch) {
            return res.json({ success: true, company: existing, token: generateToken(existing._id) })
        } else {
            return res.json({ success: false, message: "invalid  password" })
        }

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

//get company data
export const getCompanyData = async (req, res) => {
    try {
        const company = req.company
        return res.json({ success: true, company })
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

//post a new job
export const postJob = async (req, res) => {
    try {
        const { title, description, location, salary, level, category } = req.body
        const companyId = req.company._id

        const newJob = new job({
            title,
            description,
            location,
            salary,
            level,
            category,
            companyId,
            date: Date.now()
        })
        await newJob.save()
        return res.json({ success: true, newJob })


    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

//get company applications
export const getCompanyApplicants = async (req, res) => {
    try {
        const companyId=req.company._id
        //find job appplications
        const applications=await JobApplication.find({companyId})
        .populate('userId','name image resume')
        .populate('jobId','title location category level salary')
        .exec()
return res.json({success:true,applications})

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

//get company posted job
export const getCompanyPostedJobs = async (req, res) => {
    try {
        const companyId = req.company._id
        const jobs = await job.find({ companyId })

        // adding toDo No of applications
        const jobsData=await Promise.all(jobs.map(async(jobt)=>{
            const applicants=await JobApplication.find({jobId:jobt._id})
            return {...jobt.toObject(),applicants:applicants.length}
        }))
        return res.json({ success: true, jobsData })
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

//change application status
export const changeJobApplicantsStatus = async (req, res) => {
    try {
        const {id,statud}=req.body
        await JobApplication.findOneAndUpdate({_id:id},{statud})
        return res.json({success:true,message:'statust changed'})

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

//change job visiblity
export const changeVisisblity = async (req, res) => {
    try {
        const { id } = req.body
        const companyId = req.company._id
        const jobs = await job.findById(id)
        if (companyId.toString() === jobs.companyId.toString()) {
            jobs.visible = !jobs.visible
        }
        await jobs.save()
        return res.json({ success: true, jobs })
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

