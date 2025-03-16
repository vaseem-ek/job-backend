import express from 'express'
import { applyForJob, getUserData, getUserJobApplication, updateResume } from '../controller/userController.js'
import upload from '../config/multer.js'

const router=express.Router()

router.get('/user',getUserData)
router.post('/apply',applyForJob)
router.get('/application',getUserJobApplication)
router.post('/update-resume',upload.single('resume'),updateResume)

export default router