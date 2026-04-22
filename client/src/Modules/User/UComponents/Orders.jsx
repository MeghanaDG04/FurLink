import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Avatar,
  Chip,
  Button,
  IconButton,
  CircularProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CancelIcon from '@mui/icons-material/Cancel';
import ReceiptIcon from '@mui/icons-material/Receipt';

const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .order-card:hover {
    box-shadow: 0 4px 20px rgba(0,0,0,0.12);
    transform: translateY(-2px);
  }
`;
document.head.appendChild(styleSheet);

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem('Token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const res = await axios.get('http://localhost:7000/booking/userbookings', {
        headers: { 'auth-token': token }
      });
      setOrders(res.data.bookings || []);
    } catch (err) {
      console.log('Error fetching orders:', err);
      if (err.response?.data?.message?.toLowerCase().includes('token')) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Failed':
        return 'error';
      case 'Refunded':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCancelBooking = async (bookingId) => {
    const token = localStorage.getItem('Token');
    if (!token) {
      navigate('/login');
      return;
    }

    const confirm = window.confirm('Are you sure you want to cancel this booking?');
    if (!confirm) return;

    try {
      const res = await axios.put(
        `http://localhost:7000/booking/updatebooking/${bookingId}`,
        { bookingstatus: 'Cancelled' },
        { headers: { 'auth-token': token } }
      );
      if (res.data) {
        alert('Booking cancelled successfully');
        fetchOrders();
      }
    } catch (err) {
      console.log('Error cancelling booking:', err);
      alert('Failed to cancel booking');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#FF9A56' }} />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
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
          My Orders
        </Typography>
      </Box>

      {orders.length === 0 ? (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: '#f5f5f5', width: 80, height: 80 }}>
            <ShoppingBagIcon sx={{ fontSize: 40, color: '#999' }} />
          </Avatar>
          <Typography variant="h6" sx={{ mb: 1 }}>
            No orders yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            You haven't placed any orders yet. Start shopping to see your orders here.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/homepage')}
            sx={{
              background: 'linear-gradient(135deg, #FF9A56 0%, #FFB347 100%)',
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              py: 1,
              '&:hover': {
                background: 'linear-gradient(135deg, #FF8C42 0%, #FFA030 100%)'
              }
            }}
          >
            Start Shopping
          </Button>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {orders.map((order) => (
            <Paper 
              key={order._id} 
              elevation={2} 
              sx={{ 
                borderRadius: 3, 
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': { boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)' }
              }}
              className="order-card"
              onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
            >
              <Box sx={{ p: 2, bgcolor: selectedOrder === order._id ? '#fff8f0' : '#f8f9fa', display: 'flex', alignItems: 'center', gap: 2 }}>
                {order.productID?.image ? (
                  <Box
                    component="img"
                    src={`http://localhost:7000/uploads/${order.productID.image}`}
                    sx={{ width: 50, height: 50, borderRadius: 1, objectFit: 'cover' }}
                  />
                ) : (
                  <Avatar sx={{ bgcolor: selectedOrder === order._id ? '#FF9A56' : '#ddd', width: 50, height: 50 }}>
                    <ShoppingBagIcon />
                  </Avatar>
                )}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {order.productID?.name || 'Product'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Order Date: {formatDate(order.bookingDate)}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h6" fontWeight={700} sx={{ color: '#FF9A56' }}>
                    ₹{order.totalamount}
                  </Typography>
                  <Chip 
                    label={order.bookingstatus} 
                    size="small" 
                    color={getStatusColor(order.bookingstatus)}
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
                <ExpandMoreIcon sx={{ 
                  transform: selectedOrder === order._id ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }} />
              </Box>

              {selectedOrder === order._id && (
                <Box sx={{ p: 3, bgcolor: '#fff' }}>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      {order.productID?.image && (
                        <Box
                          component="img"
                          src={`http://localhost:7000/uploads/${order.productID.image}`}
                          sx={{ width: '100%', borderRadius: 2, objectFit: 'cover' }}
                        />
                      )}
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ReceiptIcon sx={{ color: '#FF9A56' }} /> Order Details
                      </Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableBody>
                            <TableRow>
                              <TableCell sx={{ border: 0, py: 0.5, pl: 0, color: '#666' }}>Order ID</TableCell>
                              <TableCell sx={{ border: 0, py: 0.5, pr: 0, textAlign: 'right', fontWeight: 600 }}>
                                {order._id.slice(-8).toUpperCase()}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ border: 0, py: 0.5, pl: 0, color: '#666' }}>Product</TableCell>
                              <TableCell sx={{ border: 0, py: 0.5, pr: 0, textAlign: 'right', fontWeight: 600 }}>
                                {order.productID?.name || 'N/A'}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ border: 0, py: 0.5, pl: 0, color: '#666' }}>Quantity</TableCell>
                              <TableCell sx={{ border: 0, py: 0.5, pr: 0, textAlign: 'right', fontWeight: 600 }}>
                                {order.quantity}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ border: 0, py: 0.5, pl: 0, color: '#666' }}>Total Amount</TableCell>
                              <TableCell sx={{ border: 0, py: 0.5, pr: 0, textAlign: 'right', fontWeight: 700, color: '#FF9A56' }}>
                                ₹{order.totalamount}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocalShippingIcon sx={{ color: '#FF9A56' }} /> Delivery Address
                      </Typography>
                      <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                        <Typography variant="body2" fontWeight={600}>{order.fullname}</Typography>
                        <Typography variant="body2" color="text.secondary">{order.address}</Typography>
                        <Typography variant="body2" color="text.secondary">Phone: {order.phone}</Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PaymentIcon sx={{ color: '#FF9A56' }} /> Payment Info
                      </Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableBody>
                            <TableRow>
                              <TableCell sx={{ border: 0, py: 0.5, pl: 0, color: '#666' }}>Payment Status</TableCell>
                              <TableCell sx={{ border: 0, py: 0.5, pr: 0, textAlign: 'right' }}>
                                <Chip 
                                  label={order.paymentstatus || 'Pending'} 
                                  size="small" 
                                  color={order.paymentstatus === 'Refunded' ? 'info' : getPaymentStatusColor(order.paymentstatus)}
                                  sx={{ fontWeight: 600 }}
                                />
                              </TableCell>
                            </TableRow>
                            {order.bookingstatus === 'Cancelled' && order.paymentmethod !== 'COD' && order.paymentstatus === 'Refunded' && (
                              <TableRow>
                                <TableCell sx={{ border: 0, py: 0.5, pl: 0, color: '#666' }}>Refund Status</TableCell>
                                <TableCell sx={{ border: 0, py: 0.5, pr: 0, textAlign: 'right', color: '#2196f3', fontWeight: 600 }}>
                                  Money will be refunded within 3-5 business days
                                </TableCell>
                              </TableRow>
                            )}
                            <TableRow>
                              <TableCell sx={{ border: 0, py: 0.5, pl: 0, color: '#666' }}>Payment Method</TableCell>
                              <TableCell sx={{ border: 0, py: 0.5, pr: 0, textAlign: 'right', fontWeight: 600 }}>
                                {order.paymentmethod || 'N/A'}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ border: 0, py: 0.5, pl: 0, color: '#666' }}>Transaction ID</TableCell>
                              <TableCell sx={{ border: 0, py: 0.5, pr: 0, textAlign: 'right', fontWeight: 600, fontSize: '0.8rem' }}>
                                {order.transactionid || 'N/A'}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ScheduleIcon sx={{ color: '#FF9A56' }} /> Timeline
                      </Typography>
                      <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 18 }} />
                          <Typography variant="body2">Order placed: {formatDate(order.bookingDate)}</Typography>
                        </Box>
                        {order.bookingstatus === 'Confirmed' && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocalShippingIcon sx={{ color: '#2196f3', fontSize: 18 }} />
                            <Typography variant="body2">Order confirmed</Typography>
                          </Box>
                        )}
                        {order.bookingstatus === 'Cancelled' && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CancelIcon sx={{ color: '#f44336', fontSize: 18 }} />
                            <Typography variant="body2">Order cancelled</Typography>
                          </Box>
                        )}
                      </Box>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    {order.bookingstatus !== 'Cancelled' && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelBooking(order._id);
                        }}
                        disabled={order.bookingstatus === 'Cancelled'}
                        sx={{
                          borderColor: '#f44336',
                          color: '#f44336',
                          borderRadius: 2,
                          textTransform: 'none',
                          '&:hover': { borderColor: '#d32f2f', bgcolor: 'rgba(244, 67, 54, 0.05)' }
                        }}
                      >
                        Cancel Booking
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/homepage');
                      }}
                      sx={{
                        borderColor: '#FF9A56',
                        color: '#FF9A56',
                        borderRadius: 2,
                        textTransform: 'none',
                        '&:hover': { borderColor: '#ff8c42', bgcolor: 'rgba(255, 154, 86, 0.05)' }
                      }}
                    >
                      Buy Again
                    </Button>
                    <Button
                      variant="contained"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/homepage');
                      }}
                      sx={{
                        background: 'linear-gradient(135deg, #FF9A56 0%, #FFB347 100%)',
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #FF8C42 0%, #FFA030 100%)'
                        }
                      }}
                    >
                      Continue Shopping
                    </Button>
                  </Box>
                </Box>
              )}
            </Paper>
          ))}
        </Box>
      )}
    </Container>
  );
}