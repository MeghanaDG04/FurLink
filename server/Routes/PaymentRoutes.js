const express = require('express');
const { processPayment, getPaymentDetails, getPaymentHistory, getAllPayments } = require('../Controller/PaymentController');
const { verifyToken } = require('../Middleware/Auth');

const route = express.Router();

route.post("/processpayment", verifyToken, processPayment);
route.get("/getpayment/:id", verifyToken, getPaymentDetails);
route.get("/paymenthistory", verifyToken, getPaymentHistory);
route.get("/allpayments", getAllPayments);

module.exports = route;
