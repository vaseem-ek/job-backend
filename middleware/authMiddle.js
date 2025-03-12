import jwt from 'jsonwebtoken'
import company from '../models/company.js'

export const protectCompany=async(req,res,next)=>{
    const token =req.headers.token
    if(!token){
        return res.json({success:false,message:"not authorised login again"})
    }
    try {
        const decode=jwt.verify(token,process.env.JWT_SECRET)
        req.company=await company.findById(decode.id).select('-password')
       
        
        
        next()
    } catch (error) {
        return res.json({success:false,message:error.message})
    }
}