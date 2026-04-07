import React, { useState, useEffect } from 'react'
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PendingIcon from '@mui/icons-material/Pending'
import CancelIcon from '@mui/icons-material/Cancel'

const statusConfig = {
  completed: { label: 'Completed', color: 'success', icon: <CheckCircleIcon sx={{ fontSize: 16 }} /> },
  pending: { label: 'Pending', color: 'warning', icon: <PendingIcon sx={{ fontSize: 16 }} /> },
  failed: { label: 'Failed', color: 'error', icon: <CancelIcon sx={{ fontSize: 16 }} /> },
}

const defaultPayments = [
  { id: 1, user: 'John Doe', email: 'john@gmail.com', amount: 2500, date: '2026-02-28', status: 'completed' },
  { id: 2, user: 'Jane Smith', email: 'jane@gmail.com', amount: 1800, date: '2026-02-27', status: 'pending' },
  { id: 3, user: 'Mike Wilson', email: 'mike@gmail.com', amount: 3200, date: '2026-02-26', status: 'completed' },
  { id: 4, user: 'Sarah Brown', email: 'sarah@gmail.com', amount: 950, date: '2026-02-25', status: 'failed' },
  { id: 5, user: 'Alex Johnson', email: 'alex@gmail.com', amount: 4100, date: '2026-02-24', status: 'completed' },
]

export default function Payment() {
  const [payments, setPayments] = useState([])

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('payments'))
    if (stored) {
      setPayments(stored)
    } else {
      localStorage.setItem('payments', JSON.stringify(defaultPayments))
      setPayments(defaultPayments)
    }
  }, [])

  const totalRevenue = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + Number(p.amount), 0)

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={1}>
        Payments
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        View all payment transactions.
      </Typography>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Paper elevation={0} sx={{
          p: 3, borderRadius: 3, flex: 1, minWidth: 200,
          background: 'linear-gradient(135deg, #43A047 0%, #66BB6A 100%)',
          color: '#fff',
        }}>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Revenue</Typography>
          <Typography variant="h4" fontWeight={700}>₹{totalRevenue}</Typography>
        </Paper>
        <Paper elevation={0} sx={{
          p: 3, borderRadius: 3, flex: 1, minWidth: 200,
          background: 'linear-gradient(135deg, #1A73E8 0%, #49a3f1 100%)',
          color: '#fff',
        }}>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Transactions</Typography>
          <Typography variant="h4" fontWeight={700}>{payments.length}</Typography>
        </Paper>
        <Paper elevation={0} sx={{
          p: 3, borderRadius: 3, flex: 1, minWidth: 200,
          background: 'linear-gradient(135deg, #FB8C00 0%, #FFA726 100%)',
          color: '#fff',
        }}>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>Pending</Typography>
          <Typography variant="h4" fontWeight={700}>
            {payments.filter((p) => p.status === 'pending').length}
          </Typography>
        </Paper>
      </Box>

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
                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Amount</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Date</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700 }} align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.length > 0 ? payments.map((payment, index) => {
                const status = statusConfig[payment.status]
                return (
                  <TableRow key={payment.id} sx={{
                    '&:hover': { bgcolor: 'rgba(102,126,234,0.05)' },
                    transition: 'background 0.2s',
                  }}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{payment.user}</TableCell>
                    <TableCell>{payment.email}</TableCell>
                    <TableCell>₹{payment.amount}</TableCell>
                    <TableCell>{payment.date}</TableCell>
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
                )
              }) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No payments found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}
