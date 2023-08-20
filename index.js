const express=require("express")
const cors=require("cors")
const swaggerJSdoc=require("swagger-jsdoc")
const swaggerUI=require("swagger-ui-express")
const { userRouter } = require("./Routes/userRoutes")
const { connection } = require("./db")
const { noteRouter } = require("./Routes/noteRoutes")
const app=express()
app.use(cors())
app.use(express.json())
app.use("/users",userRouter)
app.use("/notes",noteRouter)

app.get("/",async(req,res)=>{
    res.send("Welcome to the home page")
})

const options={
    definition:{
        openapi:"3.0.0",
        info:{
            title:"Note App",
            version:"1.0.0"
        },
        servers:[
            {
                url:"http://localhost:8080"
            }
        ]
    },
    apis:["./Routes/*.js"]
}
const openAPIspec=swaggerJSdoc(options)
app.use("/docs",cors(),swaggerUI.serve,swaggerUI.setup(openAPIspec))




app.listen(8080,async(req,res)=>{
    try {
        await connection
        console.log("Connected to Mongo Atlas")
        console.log("server is running at port 8080")
    } catch (error) {
        res.send({error})
    }
})