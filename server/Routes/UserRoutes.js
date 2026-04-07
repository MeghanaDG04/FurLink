const express = require('express')
const {registerUser, loginUser, getUsers, getUserById, deleteUser, updateUser, getProfile, updateprofile } = require('../Controller/UserController')
const auth = require('../Middleware/Auth')

const route = express.Router()

route.post('/registeruser', registerUser)
route.post("/loginuser", loginUser)
route.get('/getusers', getUsers)
route.get('/getuserbyid/:id', getUserById)
route.delete('/deleteuserbyid/:id', deleteUser)
route.put('/updateuser/:id', updateUser)

route.get('/getprofile', auth, getProfile)
route.put('/updateprofile', auth, updateprofile)


module.exports = route