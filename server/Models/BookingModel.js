const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String },
    phone: { type: Number },
    address: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    productID : { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    bookingDate: { type: Date, default: Date.now },
    quantity :{ type: Number, default: 1},
    totalamount : { type: Number},
    bookingstatus : { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
    
    paymentstatus: { type: String, enum: ['Pending', 'Paid', 'Failed', 'Refunded'], default: 'Pending' },
    paymentmethod: { type: String, enum: ['UPI', 'Card', 'COD'] },
    transactionid: { type: String }

});

module.exports = mongoose.model('Booking', bookingSchema);
