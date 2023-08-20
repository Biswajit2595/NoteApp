const express=require("express");
const bcrypt=require("bcrypt");
const { auth } = require("../middleware/authmiddleware");
const { NoteModel } = require("../model/noteModel");

const noteRouter=express.Router()

noteRouter.get("/",auth,async(req,res)=>{
    try {
        const notes=await NoteModel.find({userID:req.body.userID})
        res.status(200).send(notes)
    } catch (error) {
        res.status(400).send({error})
    }
})

noteRouter.get("/:id",auth,async(req,res)=>{
    const {id}=req.params;
    try {
        const notes=await NoteModel.findOne({_id:id})
        res.status(200).send(notes)
    } catch (error) {
        res.status(400).send({error})
    }
})

noteRouter.post("/create",auth,async(req,res)=>{
    console.log(req.body)
    try {
        const note=new NoteModel(req.body)
        await note.save()
        res.status(200).send({"msg":"New Note has been added",note})
    } catch (error) {
        res.status(400).send({error})
    }
})

noteRouter.patch("/update/:id",auth,async(req,res)=>{
    const {id}=req.params;
    const note=await NoteModel.findOne({_id:id})
    try {
        if(req.body.userID!==note.userID){
            res.send({"msg":"YOu are not authorized to make changes in this Note"})
        }else{
            await NoteModel.findByIdAndUpdate({_id:id},req.body)
            res.status(200).send({"msg":`Note with _id:${id} has been updated`})
        }
    } catch (error) {
        res.status(400).send({error})
    }
})

noteRouter.delete("/delete/:id",auth,async(req,res)=>{
    const {id}=req.params;
    const note=await NoteModel.findOne({_id:id})
    try {
        if(req.body.userID!==note.userID){
            res.send({"msg":"YOu are not authorized to make changes in this Note"})
        }else{
            await NoteModel.findByIdAndDelete({_id:id})
            res.status(200).send({"msg":`Note with _id:${id} has been deleted`})
        }
    } catch (error) {
        res.status(400).send({error})
    }
})

module.exports={noteRouter}