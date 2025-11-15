import express, { urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import dotenv from 'dotenv';
import userRoute from './routes/user.route.js'
import connectDB from './utils/db.js';

dotenv.config({})
// QM5McEdT6KjJEHSt

const app=express()

const corsoption={
    origin:'http://localhost:5173',
    credentials:true
}

app.use(cors(corsoption))

let port= process.env.port ||3000;


//routes
// app.get("/home",(req,res)=>{
//     return res.status(200).json({
//         message:"i am coming",
//         success:true
//     })
// })

//middleware

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


//api

app.use("/api/v1/user",userRoute);
    
//listening
app.listen(port,()=>{
    connectDB(),
    console.log(`server is running ${port}`)
})

// git add .
// git commit -m "Your commit message"
// git push
