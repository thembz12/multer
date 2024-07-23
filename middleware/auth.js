const userModel = require ("../userModel/usermodel.js")
const Jwt = require ("jsonwebtoken")
require("dotenv").config()

exports.authentication = async (req,res)=>{
    try{
    const auth = req.headers.authourization
    if(!auth){
        return res.status(400).json({
            message:"not authorised"
        })
    }
    const token = auth.split(" ") [1]
    if(!token){
        return res.status(404).json({
            message:"token not found"
        })
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECREt)
    const user = await userModel.findById(decodedToken.user._id)
    if(!user){
        return res.status(404).json({
            message:"Authentication failed: user ID not found"
        })
    }
    if(user.blackList.includes(token))
        return res.status(401).json({
    message:"session expired: please login to continue"})

    req.user = decodedToken
    next()

    }catch(error){
        if(error instanceof Jwt.JsonWebTokenError){
            return res.json({message:"session expired: please login to continue"})}

        res.status(500).json(error.message)
    }


}