const mongoose=require("mongoose")


const noteSchema=mongoose.Schema({
    title:String,
    body:String,
    userID:String,
    user:String
},{versionKey:false})

const NoteModel=mongoose.model("Note",noteSchema)
module.exports={NoteModel}