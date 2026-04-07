import React, { useState, useEffect } from 'react'
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Rating, Chip,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

const defaultFeedbacks = [
  { id: 1, user: 'John Doe', email: 'john@gmail.com', rating: 5, message: 'Excellent service! Very satisfied with the experience.', date: '2026-02-28' },
  { id: 2, user: 'Jane Smith', email: 'jane@gmail.com', rating: 4, message: 'Good overall experience, minor improvements needed.', date: '2026-02-27' },
  { id: 3, user: 'Mike Wilson', email: 'mike@gmail.com', rating: 3, message: 'Average service, could be better.', date: '2026-02-26' },
  { id: 4, user: 'Sarah Brown', email: 'sarah@gmail.com', rating: 5, message: 'Amazing! Will definitely recommend to others.', date: '2026-02-25' },
  { id: 5, user: 'Alex Johnson', email: 'alex@gmail.com', rating: 2, message: 'Not happy with the response time.', date: '2026-02-24' },
]

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState([])

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('feedbacks'))
    if (stored) {
      setFeedbacks(stored)
    } else {
      localStorage.setItem('feedbacks', JSON.stringify(defaultFeedbacks))
      setFeedbacks(defaultFeedbacks)
    }
  }, [])

  const handleDelete = (id) => {
    const updated = feedbacks.filter((f) => f.id !== id)
    setFeedbacks(updated)
    localStorage.setItem('feedbacks', JSON.stringify(updated))
  }

  const avgRating = feedbacks.length > 0
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : 0

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={1}>
        Feedback
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        View all user feedback and ratings.
      </Typography>

      {/* Summary */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Paper elevation={0} sx={{
          p: 3, borderRadius: 3, flex: 1, minWidth: 200,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
        }}>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>Average Rating</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Typography variant="h4" fontWeight={700}>{avgRating}</Typography>
            <Rating value={Number(avgRating)} precision={0.1} readOnly sx={{
              '& .MuiRating-iconFilled': { color: '#fff' },
              '& .MuiRating-iconEmpty': { color: 'rgba(255,255,255,0.3)' },
            }} />
          </Box>
        </Paper>
        <Paper elevation={0} sx={{
          p: 3, borderRadius: 3, flex: 1, minWidth: 200,
          background: 'linear-gradient(135deg, #43A047 0%, #66BB6A 100%)',
          color: '#fff',
        }}>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Reviews</Typography>
          <Typography variant="h4" fontWeight={700}>{feedbacks.length}</Typography>
        </Paper>
        <Paper elevation={0} sx={{
          p: 3, borderRadius: 3, flex: 1, minWidth: 200,
          background: 'linear-gradient(135deg, #1A73E8 0%, #49a3f1 100%)',
          color: '#fff',
        }}>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>5-Star Reviews</Typography>
          <Typography variant="h4" fontWeight={700}>
            {feedbacks.filter((f) => f.rating === 5).length}
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
                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Rating</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Message</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Date</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700 }} align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feedbacks.length > 0 ? feedbacks.map((fb, index) => (
                <TableRow key={fb.id} sx={{
                  '&:hover': { bgcolor: 'rgba(102,126,234,0.05)' },
                  transition: 'background 0.2s',
                }}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{fb.user}</TableCell>
                  <TableCell>{fb.email}</TableCell>
                  <TableCell>
                    <Rating value={fb.rating} readOnly size="small" />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 250 }}>{fb.message}</TableCell>
                  <TableCell>{fb.date}</TableCell>
                  <TableCell align="center">
                    <IconButton color="error" onClick={() => handleDelete(fb.id)} size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No feedback found</Typography>
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
