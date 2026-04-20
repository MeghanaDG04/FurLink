const express = require('express');
const { processPayment, getPaymentDetails, getPaymentHistory, getAllPayments } = require('../Controller/PaymentController');
const auth = require('../Middleware/Auth');

const route = express.Router();

route.post("/processpayment", auth, processPayment);
route.get("/getpayment/:id", auth, getPaymentDetails);
route.get("/paymenthistory", auth, getPaymentHistory);
route.get("/allpayments", getAllPayments);

module.exports = route;
