const express=require("express");
const bcrypt=require("bcrypt");
const { auth } = require("../middleware/authmiddleware");
const { NoteModel } = require("../model/noteModel");


/**
 * @swagger
 * conponents:
 * `schemas:
 *      Notes:
 *          type: object
 *          properties:
 *              id:
 *                  type: string
 *                  description: It will have the auto generated note id
 *              title:
 *                  type: string
 *                  description: The title of the note
 *              body:
 *                  type: string
 *                  description: The body of the Note
 */

/**
 * @swagger
 * tags:
 *  name: Notes
 *  description: All api routes related to the notes
 */

/**
 * @swagger
 * /notes/:
 *  get:
 *      summary: Get all the notes from the database
 *      tags: [Notes]
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: List of all the notes
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Notes'
 */

/**
 * @swagger
 * /notes/{id}:
 *  get:
 *      summary: Get a specific note by ID
 *      tags: [Notes]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: The ID of the note to retrieve
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: The requested note
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Notes'
 */

/**
 * @swagger
 * /notes/create:
 *  post:
 *      summary: Create a new note
 *      tags: [Notes]
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Notes'
 *      responses:
 *          200:
 *              description: New note has been added
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                              note:
 *                                  $ref: '#/components/schemas/Notes'
 */

/**
 * @swagger
 * /notes/update/{id}:
 *  patch:
 *      summary: Update a note by ID
 *      tags: [Notes]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: The ID of the note to update
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Notes'
 *      responses:
 *          200:
 *              description: Note has been updated
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 */

/**
 * @swagger
 * /notes/delete/{id}:
 *  delete:
 *      summary: Delete a note by ID
 *      tags: [Notes]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: The ID of the note to delete
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Note has been deleted
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 */


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