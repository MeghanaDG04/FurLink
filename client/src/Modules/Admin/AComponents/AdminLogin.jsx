import React, { useState } from 'react'
//import { useNavigate } from 'react-router-dom'
import { Box, TextField, Button, Typography, Paper, Alert, Avatar } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import axios from 'axios'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  //const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {

      const response = await axios.post("http://localhost:7000/admin/login", {
        email,
        password
      })

      console.log("Login Success Response:", response)

      const data = response.data

      // store token and admin info
      localStorage.setItem("adminToken", data.token)
      localStorage.setItem("adminInfo", JSON.stringify(data.admin))
      window.location.href = '/admin/dashboard';

      setSuccess("Login successful! Redirecting to dashboard...")

      // setTimeout(() => {
      //   navigate('/admin/dashboard')
      // }, 1000)

    } catch (err) {

      console.error("Login Error:", err)

      if (err.response && err.response.data.message) {
        setError(err.response.data.message)
      } else {
        setError("Login failed. Please try again.")
      }

    }
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <Paper elevation={10} sx={{
        p: 5,
        width: 400,
        borderRadius: 4,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        textAlign: 'center',
      }}>
        <Avatar sx={{
          m: 'auto', mb: 2,
          bgcolor: '#764ba2',
          width: 56, height: 56,
        }}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography variant="h5" fontWeight={700} mb={1}>
          Admin Login
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Sign in to access the admin panel
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{
              py: 1.5,
              borderRadius: 3,
              fontWeight: 700,
              fontSize: '1rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%)'
              },
            }}
          >
            Sign In
          </Button>
        </form>

      </Paper>
    </Box>
  )
}