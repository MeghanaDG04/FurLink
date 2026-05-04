import React, { useState, useEffect } from 'react'
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Rating, Chip, CircularProgress, Alert
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import axios from 'axios'

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const fetchFeedbacks = async () => {
    try {
      setLoading(true)
      const res = await axios.get('http://localhost:7000/feedback/all')
      setFeedbacks(res.data.feedbacks || [])
    } catch (err) {
      setError('Failed to fetch feedback')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:7000/feedback/delete/${id}`)
      setFeedbacks(feedbacks.filter((f) => f._id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const avgRating = feedbacks.length > 0
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : 0

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={1}>
        Feedback
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        View all user feedback and ratings.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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
                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Target</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Rating</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Message</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Date</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 700 }} align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feedbacks.length > 0 ? feedbacks.map((fb, index) => (
                <TableRow key={fb._id} sx={{
                  '&:hover': { bgcolor: 'rgba(102,126,234,0.05)' },
                  transition: 'background 0.2s',
                }}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{fb.userId?.name || 'Anonymous'}</TableCell>
                  <TableCell>{fb.userId?.email || ''}</TableCell>
                  <TableCell>
                    <Chip
                      label={fb.targetType === 'product' ? `Product: ${fb.targetName}` : `Adoption: ${fb.targetName}`}
                      size="small"
                      color={fb.targetType === 'product' ? 'primary' : 'secondary'}
                    />
                  </TableCell>
                  <TableCell>
                    <Rating value={fb.rating} readOnly size="small" />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 250 }}>{fb.comment}</TableCell>
                  <TableCell>{new Date(fb.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="center">
                    <IconButton color="error" onClick={() => handleDelete(fb._id)} size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
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