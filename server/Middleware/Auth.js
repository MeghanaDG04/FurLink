const jwt = require("jsonwebtoken");

const SECRET_KEY = "product-crud"

const authuser = async(req, res, next) => {
    try {
        const usertoken = req.header("auth-token")
        const authHeader = req.header("Authorization")
        console.log("Received token:", usertoken)
        console.log("Authorization header:", authHeader)
        console.log("All headers:", req.headers)
        if(!usertoken){
            return res.json({success: false, message: "Unauthorized - No token provided"})
        }
        const trimmedToken = usertoken.trim()
        if(!trimmedToken){
            return res.json({success: false, message: "Unauthorized - Token is empty"})
        }
        const userinfo = jwt.verify(trimmedToken, SECRET_KEY)
        console.log("Decoded user info:", userinfo)
        req.userid = userinfo.id
        next()
    } catch (error) {
        console.log("Auth error:", error.message)
        res.json({success: false, message: "Server error - Invalid token"})  
    }
}

module.exports = authuser