const express = require('express');
const { createBooking, getbooking, getBookingById, deleteBooking, updateBooking, getUserBookings } = require('../Controller/BookingController');
const auth = require('../Middleware/Auth')


const route = express.Router()

route.post("/createbooking", auth, createBooking)
route.get("/getbooking", getbooking)
route.get("/getbookingbyid/:id", getBookingById)
route.delete("/deletebooking/:id", deleteBooking)
route.put("/updatebooking/:id", updateBooking)
route.get("/userbookings", auth, getUserBookings)

module.exports = route