const jwt=require("jsonwebtoken");
const { ListModel } = require("../model/blacklistModel");


const auth=async(req,res,next)=>{
    const token=req.headers.authorization.split(" ")[1];
    try {
        const list=await ListModel.findOne({token})
        if(list){
            res.status(200).send({"msg":"Please Login Again"})
        }
        else{
            const decoded=jwt.verify(token,"masai")
            if(decoded){
                req.body.userID=decoded.userID
                req.body.user=decoded.user
                next()
            }else{
                res.status(400).send({"msg":"Please Login Again"})
            }
    }
    } catch (error) {
        res.status(400).send({"auth":error})
    }
    
}

module.exports={auth}