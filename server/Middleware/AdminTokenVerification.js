const jwt = require('jsonwebtoken')
require('dotenv').config();


const AdminTokenVerification = async (req, res, next) => {
    const token = req.headers.token;
    //checking token
    if (!token) {
        req.admin = null;
        res.status(500).json({ error: "Token is not exists" });
        console.error("Token is not exists")
        // return next()
    }
    try {


        //verifying token
        const decodeAdminToken=await jwt.verify(token, process.env.ADMIN_TOKEN_SECRET_KEY)
        req.admin=decodeAdminToken;
        return next();
    }
    catch (e) {
        req.admin = null;
        console.error("Admin, You're token is expired");
        res.json({ adminTokenExpire:"Admin, You're token is expired" })
        
    }
}

module.exports=AdminTokenVerification