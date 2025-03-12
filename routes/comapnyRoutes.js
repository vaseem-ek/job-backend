import express from 'express'
import { changeJobApplicantsStatus, changeVisisblity, getCompanyApplicants, getCompanyData, getCompanyPostedJobs, loginCompany, postJob, registerCompany } from '../controller/companyController.js'
import upload from '../config/multer.js'
import { protectCompany } from '../middleware/authMiddle.js'

const router=express.Router()

router.post('/register',upload.single('image'),registerCompany)
router.post('/login',loginCompany)
router.get('/company',protectCompany,getCompanyData)
router.post('/post-job',protectCompany,postJob)
router.get('/applicants',protectCompany,getCompanyApplicants)
router.get('/list-jobs',protectCompany,getCompanyPostedJobs)
router.post('/change-status',protectCompany,changeJobApplicantsStatus)
router.post('/change-visiblity',protectCompany,changeVisisblity)

export default router