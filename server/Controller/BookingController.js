const BookingTable = require('../Models/BookingModel');

const createBooking = async (req, res) => {
    try {
        const { fullname, email, phone, address, quantity, productID, totalamount } = req.body;
        const uid = req.userid; 

        const newBooking = new BookingTable({
            fullname,
            email,
            phone,
            address,
            quantity,
            userId: uid,
            productID,
            totalamount
        });
        const savebooking = await newBooking.save();
        res.status(201).json({ message: "Booking created successfully", booking: savebooking });
    } catch (error) {
        console.log("Booking error:", error);
        res.status(500).json({ message: "Error creating booking" });
    }
}

const getbooking = async (req,res)=>{
    try {
        const getAllbooking = await BookingTable.find().populate('productID').populate('userId', 'fullname email')
        res.status(200).json({message: "Bookings fetched successfully", allbooking: getAllbooking})
    } catch (error) {
        console.error("Error fetching bookings:", error)
        res.status(500).json({message: "Server error", error})
    }
}

const getBookingById = async (req,res)=>{
    try {
        const bid = req.params.id
        const getBookingById = await BookingTable.findById(bid)
        res.status(200).json({message: "Booking Fetched Successflly", byid: getBookingById})
      } catch (error) {
        console.error("Error fetching bookings:", error)
        res.status(500).json({message: "Server error", error})
    }
} 

const deleteBooking = async(req, res)=>{
    try{
        const duid = req.params.id
        const deleteBookingById = await BookingTable.findByIdAndDelete(duid)
        console.log(deleteBookingById)
        res.status(200).json({message:"Booking Deleted Successfully", dubyid : deleteBookingById})
    }catch(error){
        console.error("Error fetching bookings:", error)
        res.status(500).json({message: "Server error", error})
    }
}

const updateBooking = async(req, res)=>{
    try{
        const {id} = req.params
        const body = req.body
        const updatedBooking = await BookingTable.findByIdAndUpdate(id,req.body, {new:true})
        console.log(updatedBooking)
        res.status(201).json({message:"Booking Updates Successfully", bookingupdate : updatedBooking})
    }catch(error){
        console.error("Error updating bookings:", error)
        res.status(500).json({message: "Server error", error})
    }
}

module.exports = { createBooking, getbooking, getBookingById, deleteBooking, updateBooking }