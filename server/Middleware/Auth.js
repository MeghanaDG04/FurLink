const jwt = require("jsonwebtoken");
const Admin = require("../Models/AdminModel");

const SECRET_KEY = "product-crud"

const verifyToken = async(req, res, next) => {
    try {
        const usertoken = req.header("auth-token")
        if(!usertoken){
            return res.status(401).json({success: false, message: "Unauthorized - No token provided"})
        }
        const trimmedToken = usertoken.trim()
        if(!trimmedToken){
            return res.status(401).json({success: false, message: "Unauthorized - Token is empty"})
        }
        const userinfo = jwt.verify(trimmedToken, SECRET_KEY)
        req.userid = userinfo.id
        next()
    } catch (error) {
        console.log("Auth error:", error.message)
        res.status(401).json({success: false, message: "Unauthorized - Invalid token"})  
    }
}

const isAdmin = async(req, res, next) => {
    try {
        if (!req.userid) {
            return res.status(403).json({ success: false, message: "Access denied - Admin rights required" })
        }
        // Check if userid corresponds to an admin
        const admin = await Admin.findById(req.userid);
        if (!admin) {
            return res.status(403).json({ success: false, message: "Access denied - Not an admin" })
        }
        next()
    } catch (error) {
        console.error("IsAdmin error:", error);
        res.status(500).json({ success: false, message: error.message })
    }
}

module.exports = {
    verifyToken,
    isAdmin
}