const BookingTable = require('../Models/BookingModel');
const Product = require('../Models/ProductModel');
const { updatePaymentStatus } = require('./PaymentController');

const createBooking = async (req, res) => {
    try {
        const { fullname, email, phone, address, quantity, productID, totalamount } = req.body;
        const uid = req.userid; 

        const product = await Product.findById(productID);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.quantity < quantity) {
            return res.status(400).json({ message: "Insufficient stock" });
        }

        product.quantity -= quantity;
        await product.save();

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
        const { bookingstatus } = req.body
        
        const existingBooking = await BookingTable.findById(id);
        if (!existingBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const updateData = { ...req.body };

        if (existingBooking.bookingstatus !== 'Cancelled' && bookingstatus === 'Cancelled') {
            const product = await Product.findById(existingBooking.productID);
            if (product) {
                product.quantity += existingBooking.quantity;
                await product.save();
            }

            // Refund if paid via UPI/Card (not COD) and payment was made
            const paymentMethod = existingBooking.paymentmethod;
            const paymentStatus = existingBooking.paymentstatus;
            
            if (paymentMethod && paymentMethod !== 'COD' && (paymentStatus === 'Paid' || paymentStatus === 'Pending')) {
                updateData.paymentstatus = 'Refunded';
                console.log('Processing refund for booking:', existingBooking._id, 'Method:', paymentMethod, 'Status:', paymentStatus);
                try {
                    await updatePaymentStatus(existingBooking._id, 'Refunded');
                } catch (refundError) {
                    console.log('Error in refund:', refundError);
                }
            }
        }

        const updatedBooking = await BookingTable.findByIdAndUpdate(id, updateData, {new:true})
        console.log(updatedBooking)
        res.status(201).json({message:"Booking Updates Successfully", bookingupdate : updatedBooking})
    }catch(error){
        console.error("Error updating bookings:", error)
        res.status(500).json({message: "Server error", error})
    }
}

const getUserBookings = async (req, res) => {
    try {
        const userId = req.userid;
        const bookings = await BookingTable.find({ userId: userId })
            .populate('productID')
            .sort({ bookingDate: -1 });
        
        res.status(200).json({ message: "User bookings fetched successfully", bookings: bookings });
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        res.status(500).json({ message: "Server error", error });
    }
}

module.exports = { createBooking, getbooking, getBookingById, deleteBooking, updateBooking, getUserBookings }