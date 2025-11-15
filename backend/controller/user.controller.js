import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register =async(req,res)=>{
    try {
        const {fullName,email,password,role,phoneNumber}=req.body;
        if(!fullName || !phoneNumber || !email || !password || !role ){
            return res.status(400).json({
                message:"something is missing",
                success:false,
            })
        }

        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                message:"user already exist",
                success:false,
            })
        }
    const hashedPassword = await bcrypt.hash(password,10);

    await User.create({
        fullName,
        email,
        password:hashedPassword,
        role,
        phoneNumber,
    })
     return res.status(201).json({
                message:"account created successfully",
                success:true,
            })

    } catch (error) {
        console.log(error);
        
    }
}

export const login = async(req,res)=>{
    try {
        const {email,password,role}=req.body;
        if(!email ||!password || !role){
            return res.status(400).json({
                message:"soomthing is missing",
                success:false,
            })
        }

        let user = await User.findOne({email});
        if(!user){
           return res.status(400).json({
            message:"incorrect email or password",
            success:false,
           }) 
        }

        const isPassword = await  bcrypt.compare(password,user.password)

        if(!isPassword){
            return res.status(400).json({
                message:"incorrect password",
                success:false,
            })
        }

         if(role !==user.role){
            return res.status(400).json({
                message:"please provide valid role",
                success:false,
            })
         }

         const tokenData={
            userId:user._id,
         }

         const token=await jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn:'1d'})

         user={
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile,
         }
         return res.status(200).cookie("token",token,{maxAge:1*24*60*60*1000,httpOnly:true,sameSite:'strict'}).json({
            message:`welcome Back ${user.fullName}`,
            user,
            success:true,
         })
    } catch (error) {
        console.log(error);
    }
}

export const logOut = async(req,res)=>{
    try {
        return res.status(200).cookie("token","",{maxAge:0}).json({
            message:"logOut successfully",
            success:true,
        })
    } catch (error) {
        console.log(error);
        
    }
}

export  const updateProfile=async(req,res)=>{
    try {
        
        const {fullName,email,phoneNumber,bio,skills}=req.body;
        if(!fullName || !email || !phoneNumber ||!bio ||!skills){
            return res.status(400).json({
                message:"something missing",
                success:false,
            })
        }
        const skillsArr=skills.split(",");

        const userId =req.id;
        let user = await User.findById(userId);
        if(!user){
            return res.status(400).json({
                message:"user not found",
                success:false,
            })
        }

        user.fullName =fullName,
        user.email=email,
        user.phoneNumber=phoneNumber,
        user.profile.bio=bio,
        user.profile.skills=skillsArr,

        await user.save()

        user ={
            _id:user._id,
        fullName:user.fullName,
        email:user.email,
        phoneNumber:user.phoneNumber,
        role:user.role,
        profile:user.profile,  
        }
         

        return res.status(200).json({
            message:"profile updated succesfully",
            user,
            success:true,
        })
    } catch (error) {
        console.log(error);
        
    }
}