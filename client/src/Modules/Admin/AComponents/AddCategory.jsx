import React, { useState } from 'react'
import { Box, Typography, Paper, TextField, Button, Alert } from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import axios from 'axios'

export default function AddCategory() {

  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {

      const res = await axios.post(
        "http://localhost:7000/category/addcategory",
        { category, description }
      )

      setSuccess(res.data.message)
      setError('')
      setCategory('')
      setDescription('')

      setTimeout(() => setSuccess(''), 7000)

    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong")
      setSuccess('')
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Paper elevation={0} sx={{
        p: 5, width: 500, borderRadius: 4,
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0,0,0,0.05)',
        textAlign: 'center',
      }}>
        <AddCircleOutlineIcon sx={{ fontSize: 48, color: '#667eea', mb: 2 }} />

        <Typography variant="h5" fontWeight={700} mb={1}>
          Add Category
        </Typography>

        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>

          <TextField
            fullWidth
            label="Category Name"
            value={category}
            onChange={(e)=>setCategory(e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{
              py: 1.5, borderRadius: 50, fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            Add Category
          </Button>

        </form>
      </Paper>
    </Box>
  )
}