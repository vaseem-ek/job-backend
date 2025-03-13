import './config/instrument.js'
import express, { json } from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import * as Sentry from "@sentry/node";
import { clerkWebhook } from './controller/webhook.js'
import companyRoutes from './routes/comapnyRoutes.js'
import connectCloudinary from './config/cloudinary.js'
import jobRouter from './routes/jobRoutes.js'
import userRoute from './routes/userRoutes.js'
import { clerkMiddleware } from '@clerk/express'



await connectDB()
await connectCloudinary()
const app = express()

//middleware
app.use(express.json())
app.use(cors())
// app.use(clerkMiddleware())

//routes
app.get('/', (req, res) => {
    res.send('Hello World')
})
app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
});

app.post('/webhooks',clerkWebhook)
app.use('/api/company',companyRoutes)
app.use('/api/jobs',jobRouter)
app.use('/api/users',userRoute)

//port
const PORT = 5000 || process.env.PORT

Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () => {
    console.log('server running at', PORT);
})