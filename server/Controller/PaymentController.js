const BookingTable = require('../Models/BookingModel');
const PaymentTable = require('../Models/PaymentModel');

const processPayment = async (req, res) => {
    try {
        const { bookingId, paymentMethod, paymentDetails, couponApplied, discount } = req.body;
        const userId = req.userid;
        
        const booking = await BookingTable.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        let paymentStatus = 'Failed';
        let transactionId = null;
        let paymentDetailsToStore = {};

        if (paymentMethod === 'UPI') {
            if (!paymentDetails.upiId || !paymentDetails.upiId.includes('@')) {
                return res.status(400).json({ message: "Invalid UPI ID" });
            }
            transactionId = `UPI-${Date.now()}`;
            paymentStatus = 'Paid';
            paymentDetailsToStore = { upiId: paymentDetails.upiId };
        } else if (paymentMethod === 'Card') {
            if (!paymentDetails.cardNumber || !paymentDetails.expiry || !paymentDetails.cvv) {
                return res.status(400).json({ message: "Invalid card details" });
            }
            const cardNum = paymentDetails.cardNumber.replace(/\s/g, '');
            if (cardNum.length < 16) {
                return res.status(400).json({ message: "Card number must be 16 digits" });
            }
            transactionId = `CARD-${Date.now()}`;
            paymentStatus = 'Paid';
            paymentDetailsToStore = { 
                cardLast4: cardNum.slice(-4),
                cardType: detectCardType(cardNum)
            };
        } else if (paymentMethod === 'COD') {
            transactionId = `COD-${Date.now()}`;
            paymentStatus = 'Paid';
        }

        if (paymentStatus === 'Paid') {
            await BookingTable.findByIdAndUpdate(bookingId, {
                paymentstatus: 'Paid',
                paymentmethod: paymentMethod,
                transactionid: transactionId,
                bookingstatus: 'Confirmed'
            });

            const newPayment = new PaymentTable({
                bookingId: bookingId,
                userId: userId,
                paymentMethod: paymentMethod,
                transactionId: transactionId,
                orderId: `ORD${Math.floor(Math.random() * 1000000)}`,
                paymentstatus: paymentStatus,
                amount: booking.totalamount,
                discount: discount || 0,
                couponApplied: couponApplied || null,
                paymentDetails: paymentDetailsToStore,
                paymentDate: Date.now()
            });

            await newPayment.save();

            return res.status(200).json({
                message: "Payment successful",
                paymentStatus: 'Success',
                transactionId: transactionId,
                orderId: newPayment.orderId,
                bookingId: bookingId
            });
        } else {
            return res.status(400).json({
                message: "Payment failed",
                paymentStatus: 'Failed'
            });
        }
    } catch (error) {
        console.log("Payment error:", error);
        res.status(500).json({ message: "Error processing payment" });
    }
};

const detectCardType = (cardNumber) => {
    const firstDigit = cardNumber[0];
    const firstTwo = cardNumber.substring(0, 2);
    
    if (firstDigit === '4') return 'Visa';
    if (['51', '52', '53', '54', '55'].includes(firstTwo)) return 'Mastercard';
    if (['34', '37'].includes(firstTwo)) return 'Amex';
    if (firstTwo === '60' || firstTwo === '65') return 'RuPay';
    return 'Card';
};

const getPaymentDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await BookingTable.findById(id).populate('productID');
        
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const payment = await PaymentTable.findOne({ bookingId: id });

        res.status(200).json({
            message: "Payment details fetched successfully",
            payment: payment,
            booking: booking
        });
    } catch (error) {
        console.log("Error fetching payment details:", error);
        res.status(500).json({ message: "Error fetching payment details" });
    }
};

const getPaymentHistory = async (req, res) => {
    try {
        const userId = req.userid;
        
        const payments = await PaymentTable.find({ userId: userId })
            .populate('bookingId')
            .sort({ paymentDate: -1 });

        res.status(200).json({
            message: "Payment history fetched successfully",
            payments: payments
        });
    } catch (error) {
        console.log("Error fetching payment history:", error);
        res.status(500).json({ message: "Error fetching payment history" });
    }
};

const getAllPayments = async (req, res) => {
    try {
        const payments = await PaymentTable.find()
            .populate({
                path: 'bookingId',
                populate: { path: 'productID' }
            })
            .populate('userId', 'fullname email')
            .sort({ paymentDate: -1 });

        console.log('=== All payments fetched:', payments.length);
        payments.forEach(p => {
            console.log('Payment:', p._id, 'Status:', p.paymentstatus, 'Method:', p.paymentMethod, 'BookingId:', p.bookingId);
        });

        res.status(200).json({
            message: "All payments fetched successfully",
            payments: payments
        });
    } catch (error) {
        console.log("Error fetching payments:", error);
        res.status(500).json({ message: "Error fetching payments" });
    }
};

const updatePaymentStatus = async (bookingId, status) => {
    const mongoose = require('mongoose');
    try {
        console.log('Attempting to update payment for bookingId:', bookingId, 'to status:', status);
        
        // Try with string or ObjectId
        let query = { bookingId: bookingId };
        let payment = await PaymentTable.findOne(query);
        
        if (!payment && mongoose.Types.ObjectId.isValid(bookingId)) {
            query = { bookingId: new mongoose.Types.Types.ObjectId(bookingId) };
            payment = await PaymentTable.findOne(query);
        }
        
        console.log('Found payment record:', payment ? payment._id : 'NOT FOUND');
        console.log('Query used:', query);
        
        if (payment) {
            await PaymentTable.findOneAndUpdate(
                query,
                { paymentstatus: status },
                { new: true }
            );
            console.log('Payment updated to:', status);
        } else {
            console.log('No payment record exists for this booking');
        }
    } catch (error) {
        console.log("Error updating payment status:", error);
    }
};

module.exports = { 
    processPayment, 
    getPaymentDetails, 
    getPaymentHistory,
    getAllPayments,
    updatePaymentStatus 
};
