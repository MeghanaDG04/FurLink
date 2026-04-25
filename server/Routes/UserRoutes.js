const express = require('express')
const {registerUser, loginUser, getUsers, getUserById, deleteUser, updateUser, getProfile, updateprofile, verifyEmail, resetPassword } = require('../Controller/UserController')
const { verifyToken } = require('../Middleware/Auth')

const route = express.Router()

route.post('/registeruser', registerUser)
route.post("/loginuser", loginUser)
route.get('/getusers', getUsers)
route.get('/getuserbyid/:id', getUserById)
route.delete('/deleteuserbyid/:id', deleteUser)
route.put('/updateuser/:id', updateUser)

route.get('/getprofile', verifyToken, getProfile)
route.put('/updateprofile', verifyToken, updateprofile)

route.post('/verifyemail', verifyEmail)
route.post('/resetpassword', resetPassword)

module.exports = route