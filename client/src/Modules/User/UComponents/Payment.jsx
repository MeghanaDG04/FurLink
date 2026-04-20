import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Grid,
  Avatar,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  CircularProgress,
  Divider,
  IconButton,
  Collapse,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LockIcon from '@mui/icons-material/Lock';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DiscountIcon from '@mui/icons-material/Discount';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import VerifiedIcon from '@mui/icons-material/Verified';
import HomeIcon from '@mui/icons-material/Home';

const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .payment-btn:hover {
    background: linear-gradient(135deg, #2874f0 0%, #1a5ac9 100%) !important;
    box-shadow: 0 6px 20px rgba(40, 116, 240, 0.5) !important;
    transform: translateY(-2px);
  }
  .payment-option:hover {
    border-color: #2874f0;
    background: rgba(40, 116, 240, 0.05);
  }
  .coupon-input input:focus {
    border-color: #2874f0 !important;
  }
  .flipkart-checkbox:checked {
    accent-color: #2874f0;
  }
`;
document.head.appendChild(styleSheet);

const COUPONS = {
  'FIRST20': { discount: 20, minAmount: 500, description: '20% off on orders above ₹500' },
  'SAVE50': { discount: 50, minAmount: 300, description: 'Flat ₹50 off' },
  'FURLINK': { discount: 10, minAmount: 200, description: '10% off' },
  'PETLOVE': { discount: 15, minAmount: 400, description: '15% off for pet lovers' },
};

export default function Payment() {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [paymentDetails, setPaymentDetails] = useState({
    upiId: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);

  useEffect(() => {
    const savedBooking = localStorage.getItem('pendingBooking');
    if (savedBooking) {
      try {
        const parsed = JSON.parse(savedBooking);
        setBookingData(parsed);
      } catch (e) {
        console.log('Error parsing booking:', e);
        navigate('/homepage');
      }
    } else {
      navigate('/homepage');
    }
  }, [navigate]);

  const DELIVERY_CHARGE = 50;
  const PLATFORM_FEE = 0;
  
  const subtotal = bookingData?.totalamount || 0;
  const discount = appliedCoupon ? Math.floor(subtotal * (appliedCoupon.discount / 100)) : 0;
  const finalTotal = subtotal + DELIVERY_CHARGE + PLATFORM_FEE - discount;

  const calculateTotal = () => finalTotal;

  const applyCoupon = () => {
    setCouponError('');
    setCouponSuccess('');
    
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    const coupon = COUPONS[couponCode.toUpperCase()];
    
    if (!coupon) {
      setCouponError('Invalid coupon code');
      return;
    }

    if (subtotal < coupon.minAmount) {
      setCouponError(`Minimum order amount ₹${coupon.minAmount} required`);
      return;
    }

    setAppliedCoupon(coupon);
    setCouponSuccess(`Coupon applied! You saved ₹${Math.floor(subtotal * (coupon.discount / 100))}`);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponSuccess('');
    setCouponError('');
  };

  const validatePaymentDetails = () => {
    const errors = {};
    
    if (paymentMethod === 'UPI') {
      if (!paymentDetails.upiId) {
        errors.upiId = 'UPI ID is required';
      } else if (!paymentDetails.upiId.includes('@')) {
        errors.upiId = 'Invalid UPI ID format';
      }
    } else if (paymentMethod === 'Card') {
      const cardNum = paymentDetails.cardNumber.replace(/\s/g, '');
      if (!cardNum) {
        errors.cardNumber = 'Card number is required';
      } else if (cardNum.length < 16) {
        errors.cardNumber = 'Card number must be 16 digits';
      }
      if (!paymentDetails.expiry) {
        errors.expiry = 'Expiry date is required';
      }
      if (!paymentDetails.cvv) {
        errors.cvv = 'CVV is required';
      } else if (paymentDetails.cvv.length < 3) {
        errors.cvv = 'CVV must be 3 or 4 digits';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    setValidationErrors({});
    setErrorMsg('');
  };

  const handlePaymentDetailChange = (field, value) => {
    if (field === 'cardNumber') {
      const formatted = value.replace(/\D/g, '').slice(0, 16);
      const parts = formatted.match(/.{1,4}/g);
      setPaymentDetails({ ...paymentDetails, cardNumber: parts ? parts.join(' ') : formatted });
    } else if (field === 'expiry') {
      const cleaned = value.replace(/\D/g, '').slice(0, 4);
      if (cleaned.length >= 2) {
        setPaymentDetails({ ...paymentDetails, expiry: cleaned.slice(0, 2) + '/' + cleaned.slice(2) });
      } else {
        setPaymentDetails({ ...paymentDetails, expiry: cleaned });
      }
    } else if (field === 'cvv') {
      setPaymentDetails({ ...paymentDetails, cvv: value.replace(/\D/g, '').slice(0, 4) });
    } else {
      setPaymentDetails({ ...paymentDetails, [field]: value });
    }
    setValidationErrors({ ...validationErrors, [field]: '' });
  };

  const handleSubmit = async () => {
    if (!validatePaymentDetails()) {
      setErrorMsg('Please fill in all required payment details correctly');
      return;
    }

    const token = localStorage.getItem('Token');
    if (!token) {
      setErrorMsg('Please login to complete payment');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    try {
      setProcessing(true);
      setErrorMsg('');
      setSuccessMsg('');

      await new Promise(resolve => setTimeout(resolve, 2000));

      const transactionId = `TXN${Date.now()}`;
      const orderId = `ORD${Math.floor(Math.random() * 1000000)}`;

      const res = await axios.post(
        'http://localhost:7000/payment/processpayment',
        {
          bookingId: bookingData.bookingId,
          paymentMethod,
          paymentDetails,
          couponApplied: appliedCoupon ? couponCode.toUpperCase() : null,
          discount: discount
        },
        {
          headers: {
            'auth-token': token
          }
        }
      );

      if (res.data.paymentStatus === 'Success' || paymentMethod === 'COD') {
        setTransactionDetails({
          orderId: orderId,
          transactionId: transactionId,
          paymentMethod: paymentMethod,
          amountPaid: calculateTotal(),
          discount: discount,
          date: new Date().toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        });
        setShowConfirmation(true);
        localStorage.removeItem('pendingBooking');
      } else {
        setErrorMsg('Payment failed. Please try again.');
      }
    } catch (err) {
      console.log('Payment error:', err);
      const message = err.response?.data?.message || '';
      if (message.toLowerCase().includes('token')) {
        setErrorMsg('Session expired. Please login again');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setErrorMsg(message || 'Payment failed. Please try again.');
      }
    } finally {
      setProcessing(false);
    }
  };

  if (!bookingData) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#2874f0' }} />
      </Container>
    );
  }

  if (showConfirmation && transactionDetails) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Paper elevation={4} sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <Box sx={{ 
            background: 'linear-gradient(135deg, #26a69a 0%, #00897b 100%)',
            py: 4,
            px: 3,
            textAlign: 'center'
          }}>
            <Avatar sx={{ 
              mx: 'auto', 
              mb: 2, 
              width: 80, 
              height: 80, 
              bgcolor: '#fff',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}>
              <CheckCircleIcon sx={{ fontSize: 50, color: '#26a69a' }} />
            </Avatar>
            <Typography variant="h5" fontWeight={700} sx={{ color: '#fff', mb: 1 }}>
              Order Confirmed!
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
              Thank you for your purchase
            </Typography>
          </Box>

          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
              <ReceiptIcon sx={{ color: '#2874f0' }} />
              <Typography variant="h6" fontWeight={600}>
                Order Details
              </Typography>
            </Box>

            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ border: 0, py: 1, color: '#666' }}>Order ID</TableCell>
                    <TableCell sx={{ border: 0, py: 1, textAlign: 'right', fontWeight: 600 }}>
                      {transactionDetails.orderId}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ border: 0, py: 1, color: '#666' }}>Transaction ID</TableCell>
                    <TableCell sx={{ border: 0, py: 1, textAlign: 'right', fontWeight: 600 }}>
                      {transactionDetails.transactionId}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ border: 0, py: 1, color: '#666' }}>Payment Method</TableCell>
                    <TableCell sx={{ border: 0, py: 1, textAlign: 'right', fontWeight: 600 }}>
                      <Chip 
                        label={transactionDetails.paymentMethod} 
                        size="small" 
                        color="primary"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ border: 0, py: 1, color: '#666' }}>Amount Paid</TableCell>
                    <TableCell sx={{ border: 0, py: 1, textAlign: 'right', fontWeight: 700, fontSize: '1.1rem', color: '#26a69a' }}>
                      ₹{transactionDetails.amountPaid}
                    </TableCell>
                  </TableRow>
                  {transactionDetails.discount > 0 && (
                    <TableRow>
                      <TableCell sx={{ border: 0, py: 1, color: '#666' }}>Discount Availed</TableCell>
                      <TableCell sx={{ border: 0, py: 1, textAlign: 'right', fontWeight: 600, color: '#4caf50' }}>
                        -₹{transactionDetails.discount}
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell sx={{ border: 0, py: 1, color: '#666' }}>Date & Time</TableCell>
                    <TableCell sx={{ border: 0, py: 1, textAlign: 'right', fontWeight: 500 }}>
                      {transactionDetails.date}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <LocalAtmIcon sx={{ color: '#2874f0' }} />
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  {transactionDetails.paymentMethod === 'COD' 
                    ? 'Cash on Delivery order placed'
                    : 'Payment successful'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Order will be delivered within 5-7 business days
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate('/homepage')}
              sx={{
                mt: 3,
                py: 1.5,
                background: '#2874f0',
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { background: '#1a5ac9' }
              }}
            >
              Continue Shopping
            </Button>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate('/myorders')}
              sx={{
                mt: 1,
                py: 1.5,
                borderColor: '#2874f0',
                color: '#2874f0',
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { borderColor: '#1a5ac9', bgcolor: 'rgba(40, 116, 240, 0.05)' }
              }}
            >
              View My Orders
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            mr: 1,
            background: '#f5f5f5',
            '&:hover': { background: '#e0e0e0' }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={700} sx={{ color: '#2D3748' }}>
          Checkout
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ borderRadius: 3, mb: 3, overflow: 'hidden' }}>
            <Box sx={{ 
              bgcolor: '#2874f0', 
              py: 2, 
              px: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <ShoppingBagIcon sx={{ color: '#fff' }} />
              <Typography variant="h6" fontWeight={600} sx={{ color: '#fff' }}>
                Order Summary
              </Typography>
            </Box>

            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Avatar sx={{ width: 60, height: 60, bgcolor: '#f0f0f0' }}>
                  <ShoppingBagIcon sx={{ color: '#2874f0' }} />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {bookingData.productName || 'Product'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quantity: {bookingData.quantity || 1}
                  </Typography>
                </Box>
                <Box sx={{ ml: 'auto', textAlign: 'right' }}>
                  <Typography variant="h6" fontWeight={700} sx={{ color: '#2874f0' }}>
                    ₹{bookingData.totalamount || 0}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Price Details
              </Typography>
              
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ border: 0, py: 0.8, pl: 0 }}>Price ({bookingData.quantity || 1} item)</TableCell>
                      <TableCell sx={{ border: 0, py: 0.8, pr: 0, textAlign: 'right' }}>₹{subtotal}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ border: 0, py: 0.8, pl: 0 }}>Delivery Charges</TableCell>
                      <TableCell sx={{ border: 0, py: 0.8, pr: 0, textAlign: 'right' }}>
                        {DELIVERY_CHARGE > 0 ? (
                          <Box component="span">₹{DELIVERY_CHARGE}</Box>
                        ) : (
                          <Box component="span" sx={{ color: '#4caf50', fontWeight: 600 }}>FREE</Box>
                        )}
                      </TableCell>
                    </TableRow>
                    {appliedCoupon && (
                      <TableRow>
                        <TableCell sx={{ border: 0, py: 0.8, pl: 0, color: '#4caf50' }}>
                          Discount ({appliedCoupon.discount}% off)
                        </TableCell>
                        <TableCell sx={{ border: 0, py: 0.8, pr: 0, textAlign: 'right', color: '#4caf50', fontWeight: 600 }}>
                          -₹{discount}
                        </TableCell>
                      </TableRow>
                    )}
                    {PLATFORM_FEE > 0 && (
                      <TableRow>
                        <TableCell sx={{ border: 0, py: 0.8, pl: 0 }}>Platform Fee</TableCell>
                        <TableCell sx={{ border: 0, py: 0.8, pr: 0, textAlign: 'right' }}>₹{PLATFORM_FEE}</TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell sx={{ border: 0, py: 1, pl: 0, fontWeight: 700, fontSize: '1.1rem' }}>Total Amount</TableCell>
                      <TableCell sx={{ border: 0, py: 1, pr: 0, textAlign: 'right', fontWeight: 700, fontSize: '1.1rem', color: '#2874f0' }}>
                        ₹{calculateTotal()}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              {discount > 0 && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#e8f5e9', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DiscountIcon sx={{ color: '#4caf50' }} />
                    <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 600 }}>
                      You saved ₹{discount} on this order!
                    </Typography>
                  </Box>
                  <Button size="small" onClick={removeCoupon} sx={{ color: '#2e7d32', textTransform: 'none' }}>
                    Remove
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>

          <Paper elevation={2} sx={{ borderRadius: 3, mb: 3, overflow: 'hidden' }}>
            <Box sx={{ 
              bgcolor: '#2874f0', 
              py: 2, 
              px: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <PaymentIcon sx={{ color: '#fff' }} />
              <Typography variant="h6" fontWeight={600} sx={{ color: '#fff' }}>
                Payment Method
              </Typography>
            </Box>

            <Box sx={{ p: 3 }}>
              {errorMsg && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {errorMsg}
                </Alert>
              )}

              {successMsg && (
                <Alert severity="success" sx={{ mb: 3 }} icon={<CheckCircleIcon />}>
                  {successMsg}
                </Alert>
              )}

              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <RadioGroup value={paymentMethod} onChange={handlePaymentMethodChange}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      mb: 2,
                      border: '2px solid',
                      borderColor: paymentMethod === 'UPI' ? '#2874f0' : '#e0e0e0',
                      borderRadius: 3,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    className="payment-option"
                    onClick={() => setPaymentMethod('UPI')}
                  >
                    <FormControlLabel
                      value="UPI"
                      control={<Radio sx={{ color: '#2874f0', '&.Mui-checked': { color: '#2874f0' } }} />}
                      sx={{ width: '100%', m: 0 }}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                          <AccountBalanceWalletIcon sx={{ color: '#2874f0', fontSize: 28 }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" fontWeight={600}>UPI</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Pay instantly using Google Pay, PhonePe, Paytm & more
                            </Typography>
                          </Box>
                          <Chip label="Recommended" size="small" color="primary" variant="outlined" sx={{ height: 24 }} />
                        </Box>
                      }
                    />
                  </Paper>

                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      mb: 2,
                      border: '2px solid',
                      borderColor: paymentMethod === 'Card' ? '#2874f0' : '#e0e0e0',
                      borderRadius: 3,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    className="payment-option"
                    onClick={() => setPaymentMethod('Card')}
                  >
                    <FormControlLabel
                      value="Card"
                      control={<Radio sx={{ color: '#2874f0', '&.Mui-checked': { color: '#2874f0' } }} />}
                      sx={{ width: '100%', m: 0 }}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                          <CreditCardIcon sx={{ color: '#2874f0', fontSize: 28 }} />
                          <Box>
                            <Typography variant="body1" fontWeight={600}>Credit / Debit Card</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Visa, Mastercard, RuPay & more
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </Paper>

                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      mb: 2,
                      border: '2px solid',
                      borderColor: paymentMethod === 'COD' ? '#2874f0' : '#e0e0e0',
                      borderRadius: 3,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    className="payment-option"
                    onClick={() => setPaymentMethod('COD')}
                  >
                    <FormControlLabel
                      value="COD"
                      control={<Radio sx={{ color: '#2874f0', '&.Mui-checked': { color: '#2874f0' } }} />}
                      sx={{ width: '100%', m: 0 }}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                          <LocalAtmIcon sx={{ color: '#2874f0', fontSize: 28 }} />
                          <Box>
                            <Typography variant="body1" fontWeight={600}>Cash on Delivery</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Pay when you receive your order
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </Paper>
                </RadioGroup>
              </FormControl>

              <Collapse in={paymentMethod === 'UPI'}>
                <Box sx={{ mt: 3, p: 3, bgcolor: '#fff8e1', borderRadius: 3, border: '1px solid #ffecb3' }}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccountBalanceWalletIcon sx={{ color: '#f9a825' }} /> Enter UPI ID
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="yourname@upi"
                    value={paymentDetails.upiId}
                    onChange={(e) => handlePaymentDetailChange('upiId', e.target.value)}
                    error={!!validationErrors.upiId}
                    helperText={validationErrors.upiId || 'Example: john@ybl, john@okicici, john@paytm'}
                    sx={{
                      bgcolor: '#fff',
                      '& .MuiOutlinedInput-root': { borderRadius: 2 }
                    }}
                  />
                </Box>
              </Collapse>

              <Collapse in={paymentMethod === 'Card'}>
                <Box sx={{ mt: 3, p: 3, bgcolor: '#fff8e1', borderRadius: 3, border: '1px solid #ffecb3' }}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CreditCardIcon sx={{ color: '#f9a825' }} /> Card Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        placeholder="1234 5678 9012 3456"
                        value={paymentDetails.cardNumber}
                        onChange={(e) => handlePaymentDetailChange('cardNumber', e.target.value)}
                        error={!!validationErrors.cardNumber}
                        helperText={validationErrors.cardNumber}
                        inputProps={{ maxLength: 19 }}
                        sx={{ bgcolor: '#fff', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        placeholder="MM/YY"
                        value={paymentDetails.expiry}
                        onChange={(e) => handlePaymentDetailChange('expiry', e.target.value)}
                        error={!!validationErrors.expiry}
                        helperText={validationErrors.expiry}
                        inputProps={{ maxLength: 5 }}
                        sx={{ bgcolor: '#fff', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        placeholder="CVV"
                        type="password"
                        value={paymentDetails.cvv}
                        onChange={(e) => handlePaymentDetailChange('cvv', e.target.value)}
                        error={!!validationErrors.cvv}
                        helperText={validationErrors.cvv}
                        inputProps={{ maxLength: 4 }}
                        sx={{ bgcolor: '#fff', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Collapse>

              <Collapse in={paymentMethod === 'COD'}>
                <Box sx={{ mt: 3, p: 3, bgcolor: '#e8f5e9', borderRadius: 3, border: '1px solid #c8e6c9' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LocalAtmIcon sx={{ color: '#4caf50', fontSize: 32 }} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#2e7d32' }}>
                        Cash on Delivery
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        You will pay <strong>₹{calculateTotal()}</strong> when your order is delivered
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Collapse>
            </Box>
          </Paper>

          <Paper elevation={2} sx={{ borderRadius: 3, p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <LocalOfferIcon sx={{ color: '#2874f0' }} />
              <Typography variant="subtitle1" fontWeight={600}>Apply Coupon</Typography>
            </Box>
            
            {appliedCoupon ? (
              <Box sx={{ p: 2, bgcolor: '#e8f5e9', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" fontWeight={600} sx={{ color: '#2e7d32' }}>
                    {couponCode.toUpperCase()} Applied
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {appliedCoupon.description}
                  </Typography>
                </Box>
                <Button size="small" onClick={removeCoupon} sx={{ color: '#d32f2f' }}>Remove</Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  error={!!couponError}
                  className="coupon-input"
                  sx={{ 
                    '& .MuiOutlinedInput-root': { borderRadius: 2 },
                    bgcolor: '#fff'
                  }}
                />
                <Button 
                  variant="outlined" 
                  onClick={applyCoupon}
                  sx={{ 
                    borderColor: '#2874f0', 
                    color: '#2874f0',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': { borderColor: '#1a5ac9', bgcolor: 'rgba(40, 116, 240, 0.05)' }
                  }}
                >
                  Apply
                </Button>
              </Box>
            )}
            
            {(couponError || couponSuccess) && (
              <Typography 
                variant="caption" 
                sx={{ mt: 1, display: 'block', color: couponError ? '#d32f2f' : '#2e7d32', fontWeight: 600 }}
              >
                {couponError || couponSuccess}
              </Typography>
            )}
            
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {Object.keys(COUPONS).map(code => (
                <Chip
                  key={code}
                  label={code}
                  size="small"
                  onClick={() => {
                    setCouponCode(code);
                    setCouponError('');
                    setCouponSuccess('');
                  }}
                  sx={{ 
                    bgcolor: '#f5f5f5',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#e0e0e0' }
                  }}
                />
              ))}
            </Box>
          </Paper>

          <Paper elevation={2} sx={{ borderRadius: 3, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <VerifiedUserIcon sx={{ color: '#4caf50', fontSize: 28 }} />
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  Safe & Secure Payment
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Your payment information is encrypted
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LockIcon sx={{ color: '#666', fontSize: 18 }} />
              <Typography variant="caption" color="text.secondary">
                SSL Encrypted
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ borderRadius: 3, position: 'sticky', top: 20 }}>
            <Box sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <HomeIcon sx={{ color: '#2874f0' }} /> Delivery Address
              </Typography>
              <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2, mb: 3 }}>
                <Typography variant="body2" fontWeight={600}>
                  User Address
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  Full address will be displayed here from booking form
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Order Total</Typography>
                <Typography variant="body2" fontWeight={600}>₹{subtotal + DELIVERY_CHARGE}</Typography>
              </Box>
              {discount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: '#4caf50' }}>Discount</Typography>
                  <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>-₹{discount}</Typography>
                </Box>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" fontWeight={700}>Total</Typography>
                <Typography variant="h5" fontWeight={700} sx={{ color: '#2874f0' }}>
                  ₹{calculateTotal()}
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                className="payment-btn"
                onClick={handleSubmit}
                disabled={processing}
                startIcon={processing ? null : <VerifiedIcon />}
                sx={{
                  py: 1.8,
                  background: 'linear-gradient(135deg, #2874f0 0%, #1a5ac9 100%)',
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: '1rem',
                  textTransform: 'none',
                  boxShadow: '0 4px 15px rgba(40, 116, 240, 0.4)',
                }}
              >
                {processing ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} sx={{ color: '#fff' }} />
                    <Typography>Processing...</Typography>
                  </Box>
                ) : paymentMethod === 'COD' ? (
                  'Place Order'
                ) : (
                  `Pay ₹${calculateTotal()}`
                )}
              </Button>

              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <LockIcon sx={{ color: '#666', fontSize: 16 }} />
                <Typography variant="caption" color="text.secondary">
                  100% Secure Payment
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
