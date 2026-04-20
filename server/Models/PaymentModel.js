const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    bookingId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Booking', 
        required: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    paymentMethod: { 
        type: String, 
        enum: ['UPI', 'Card', 'COD'], 
        required: true 
    },
    transactionId: { 
        type: String, 
        required: true 
    },
    orderId: { 
        type: String 
    },
    paymentstatus: { 
        type: String, 
        enum: ['Pending', 'Paid', 'Failed', 'Refunded'], 
        default: 'Pending' 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    discount: { 
        type: Number, 
        default: 0 
    },
    couponApplied: { 
        type: String 
    },
    paymentDetails: {
        upiId: { type: String },
        cardLast4: { type: String },
        cardType: { type: String }
    },
    paymentDate: { 
        type: Date, 
        default: Date.now 
    },
    paymentFailureReason: { 
        type: String 
    }
});

module.exports = mongoose.model('Payment', paymentSchema);
