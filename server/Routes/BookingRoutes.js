const express = require('express');
const { createBooking, getbooking, getBookingById, deleteBooking, updateBooking, getUserBookings } = require('../Controller/BookingController');
const { verifyToken } = require('../Middleware/Auth')


const route = express.Router()

route.post("/createbooking", verifyToken, createBooking)
route.get("/getbooking", getbooking)
route.get("/getbookingbyid/:id", getBookingById)
route.delete("/deletebooking/:id", deleteBooking)
route.put("/updatebooking/:id", updateBooking)
route.get("/userbookings", verifyToken, getUserBookings)

module.exports = route