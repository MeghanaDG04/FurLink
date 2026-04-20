import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Grid, CircularProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PaymentIcon from '@mui/icons-material/Payment';

const statusConfig = {
  Paid: { label: 'Paid', color: 'success', icon: <CheckCircleIcon sx={{ fontSize: 16 }} /> },
  Pending: { label: 'Pending', color: 'warning', icon: <PendingIcon sx={{ fontSize: 16 }} /> },
  Failed: { label: 'Failed', color: 'error', icon: <CancelIcon sx={{ fontSize: 16 }} /> },
  Refunded: { label: 'Refunded', color: 'info', icon: <CancelIcon sx={{ fontSize: 16 }} /> },
};

export default function ManagePayment() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get('http://localhost:7000/payment/allpayments');
      setPayments(res.data.payments || []);
    } catch (err) {
      console.log('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = payments
    .filter((p) => p.paymentstatus === 'Paid')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress sx={{ color: '#667eea' }} />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={1}>
        Payments
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        View all payment transactions.
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{
            p: 3, borderRadius: 3,
            background: 'linear-gradient(135deg, #43A047 0%, #66BB6A 100%)',
            color: '#fff',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <AccountBalanceWalletIcon />
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Revenue</Typography>
            </Box>
            <Typography variant="h4" fontWeight={700}>₹{totalRevenue.toLocaleString()}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{
            p: 3, borderRadius: 3,
            background: 'linear-gradient(135deg, #1A73E8 0%, #49a3f1 100%)',
            color: '#fff',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <ReceiptLongIcon />
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Transactions</Typography>
            </Box>
            <Typography variant="h4" fontWeight={700}>{payments.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{
            p: 3, borderRadius: 3,
            background: 'linear-gradient(135deg, #FB8C00 0%, #FFA726 100%)',
            color: '#fff',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <PendingIcon />
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Pending</Typography>
            </Box>
            <Typography variant="h4" fontWeight={700}>
              {payments.filter((p) => p.paymentstatus === 'Pending').length}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Table */}
      <Paper elevation={0} sx={{
        borderRadius: 3,
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0,0,0,0.05)',
      }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>#</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>User</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Order ID</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Transaction ID</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Method</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Amount</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Date</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700 }} align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.length > 0 ? payments.map((payment, index) => {
                const status = statusConfig[payment.paymentstatus] || statusConfig.Pending;
                return (
                  <TableRow key={payment._id} sx={{
                    '&:hover': { bgcolor: 'rgba(102,126,234,0.05)' },
                    transition: 'background 0.2s',
                  }}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {payment.userId?.fullname || 'User'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {payment.userId?.email || ''}
                      </Typography>
                    </TableCell>
                    <TableCell>{payment.orderId || 'N/A'}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem' }}>{payment.transactionId || 'N/A'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={payment.paymentMethod || 'COD'} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={700} color="primary">
                        ₹{payment.amount}
                      </Typography>
                    </TableCell>
                    <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                    <TableCell align="center">
                      <Chip
                        icon={status.icon}
                        label={status.label}
                        color={status.color}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                );
              }) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No payments found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}