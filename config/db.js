import mongoose from "mongoose";

const connectionString=process.env.MONGODB_URI

const connectDB=async()=>{
    mongoose.connection.on('connected',()=>console.log("Database connected"))
    await mongoose.connect(connectionString)
}

export default connectDB