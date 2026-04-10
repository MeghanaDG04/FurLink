const usertable = require("../Models/UserModel")
const jwt = require("jsonwebtoken");

const SECRET_KEY = "product-crud"



const registerUser = async (req,res)=>{
    try {
        const {name,email,password,phone,address} = req.body

        const useremail = await usertable.findOne({email: email})

        if(useremail){
            return res.status(400).json({message: "Email already exists"})
        }

        const userdetails = new usertable({
            name,
            email,
            password,
            phone,
            address
        })

        await userdetails.save()

        res.status(201).json({
            message: "User registered successfully",
            udata: userdetails
        })

    } catch (error) {
        console.error("Error registering user:", error)
        res.status(500).json({message: "Server error", error})
    }
}

// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await usertable.findOne({
      $or: [{ email: email }, { name: email }],
    });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    if (user.password !== password) {
      return res.status(401).json({ message: "Wrong password" });
    }
    // JWT TOKEN
    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1d" });
    res.json({ success: true,  message: "Login successful", udata: user, token: token, });
  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const getUsers = async (req,res)=>{
    try {
        const getAllUsers = await usertable.find()
        res.status(200).json({message: "Users fetched successfully", alluser: getAllUsers})
    } catch (error) {
        console.error("Error fetching users:", error)
        res.status(500).json({message: "Server error", error})
    }
}

const getUserById = async (req,res)=>{
    try {
        const uid = req.params.id
        const getUserById = await usertable.findById(uid)
        res.status(200).json({message: "User Fetched Successflly", byid: getUserById})
      } catch (error) {
        console.error("Error fetching users:", error)
        res.status(500).json({message: "Server error", error})
    }
} 

const deleteUser = async(req, res)=>{
    try{
        const duid = req.params.id
        const deleteUserById = await usertable.findByIdAndDelete(duid)
        console.log(deleteUserById)
        res.status(200).json({message:"User Deleted Successfully", dubyid : deleteUserById})
    }catch(error){
        console.error("Error fetching users:", error)
        res.status(500).json({message: "Server error", error})
    }
}

const updateUser = async(req, res)=>{
    try{
        const {id} = req.params
        const body = req.body
        const updatedUser = await usertable.findByIdAndUpdate(id,req.body, {new:true})
        console.log(updatedUser)
        res.status(201).json({message:"User Updates Successfully", userupdate : updatedUser})
    }catch(error){
        console.error("Error updating users:", error)
        res.status(500).json({message: "Server error", error})
    }
}

const getProfile = async(req, res)=>{
    try{
        const user = await usertable.findById(req.userid)
        res.json({success: true ,udata: user})
    }catch(error){
        console.log(error)
        res.status(500).json({message: "Server error"})
    }
}

const updateprofile = async(req,res)=>{
    try{
        const updateduser = await usertable.findByIdAndUpdate(req.userid, req.body, {new:true})
        res.json({success: true, message: "Profile Updated Successfully", udetails: updateduser})
    }catch(error){
        console.log(error)
        res.status(500).json({message: "Server error"})
    }
}

const verifyEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await usertable.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ success: false, message: "No account found with this email address" });
        }
        res.json({ success: true, message: "Email verified", userId: user._id });
    } catch (error) {
        console.log("VERIFY EMAIL ERROR:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { userId, newPassword } = req.body;
        const user = await usertable.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        user.password = newPassword;
        await user.save();
        res.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        console.log("RESET PASSWORD ERROR:", error);
        res.status(500).json({ message: "Server error" });
    }
};
    
module.exports = { registerUser, loginUser ,getUsers, getUserById, deleteUser, updateUser, getProfile, updateprofile, verifyEmail, resetPassword }
