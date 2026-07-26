const jwt=require('jsonwebtoken')
require('dotenv').config()

const TokenVerification=async(req,res,next)=>{
    const token=await req.headers.token;
    if(!token){
        req.user=null
        console.log("You're not logged in")
        res.status(401).json({error:"You're not logged in"})
        // return next()
    }
    
    try{
        const decodeToken=await jwt.verify(token, process.env.TOKEN_SECRET_KEY)
        req.user=decodeToken;
        return next()
    }
    catch(e){
        req.user=null;
        console.error("You're token expired")
        res.json({userTokenExpireError: "You're token expired"})
    }
    
    
}

module.exports=TokenVerification