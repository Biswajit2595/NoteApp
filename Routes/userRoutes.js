const express=require("express");
const { UserModel } = require("../model/userModel");
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken");
const { ListModel } = require("../model/blacklistModel");

const userRouter=express.Router()

userRouter.post("/register",async(req,res)=>{
    const {email,pass}=req.body;
    // console.log(req.body)
    try {
        const user=await UserModel.findOne({email})
        if(user){
            res.send({"msg":"User is already Registered"})
        }else{
            bcrypt.hash(pass,5,async(err,hash)=>{
                if(err){
                    res.send({"errorr":err})
                }else{
                    const newUser=new UserModel({...req.body,pass:hash})
                    await newUser.save()
                    res.send({"msg":"User has been Successfully Registered"})
                }
            })
        }
    } catch (error) {
        res.send({"err":error})
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,pass}=req.body;
    try {
        const user=await UserModel.findOne({email})
        if(!user){
            res.send({"msg":"User does not exists"})
        }else{
            bcrypt.compare(pass,user.pass,(err,result)=>{
                if(result){
                    const token=jwt.sign({userID:user._id,user:user.username},"masai")
                    res.status(200).send({"msg":`${user.username} successfully Logged in`,token})
                }else{
                    res.send({"err":"wrong credentials"})
                }
            })
        }
    } catch (error) {
        res.status(500).send({error})
    }
})

userRouter.get("/logout",async(req,res)=>{
    const token=req.headers.authorization.split(" ")[1]
    try {
        const list=new ListModel({token})
        await list.save()
        res.status(200).send({"msg":"User have been successfullly Logged In"})
    } catch (error) {
        res.status(400).send({"msg":error})
    }
})








module.exports={userRouter}