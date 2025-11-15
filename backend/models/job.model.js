import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title:{type:String,required:true},
    discreption:{type:String,required:true},
    requirement:[{type:String}],
    salary:{type:Number,required:true},
    location:{type:String,required:true},
    jobType:{enum:['part-time','full-time','itern'],required:true},
    position:{type:Number,required:true},
    company:{type:mongoose.Schema.Types.ObjectId,ref:'Company',required:true},
    createdAt:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    applications:[{type:mongoose.Schema.Types.ObjectId,ref:'Application'}]
},{timestamps:true})

export const Job = mongoose.model('Job',jobSchema);