import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Box, AppBar, Toolbar, Typography, Avatar } from '@mui/material'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import AdminLogin from '../AComponents/AdminLogin'
import Sidebar from '../AComponents/Sidebar'
import AHome from '../AComponents/AHome'
import Manageuser from '../AComponents/Manageuser'
import AddCategory from '../AComponents/AddCategory'
import ViewCategory from '../AComponents/ViewCategory'
import ManageProduct from '../AComponents/ManageProduct'
import ManagePayment from '../AComponents/ManagePayment'
import Feedback from '../AComponents/Feedback'
import ViewUser from '../AComponents/ViewUser'
import UpdateUser from '../AComponents/UpdateUser'
import ManageBooking from '../AComponents/ManageBooking'

const drawerWidth = 260

function AdminLayout() {
  const admin = JSON.parse(localStorage.getItem('adminInfo'))

  if (!admin) return <Navigate to='/admin/login' replace />

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      <Sidebar />

      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(124,185,232,0.15)',
          boxShadow: '0 2px 20px rgba(124,185,232,0.1)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'flex-end' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 2, fontWeight: 500 }}>
            {admin.email}
          </Typography>

          <Avatar sx={{
            width: 36,
            height: 36,
            background: 'linear-gradient(135deg, #7CB9E8 0%, #A8D8EA 100%)',
            boxShadow: '0 2px 8px rgba(124,185,232,0.3)',
          }}>
            <AdminPanelSettingsIcon sx={{ fontSize: 20, color: '#fff' }} />
          </Avatar>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />

        <Routes>
          <Route path='/dashboard' element={<AHome />} />
          <Route path='/users' element={<Manageuser />} />
          <Route path='/category/add' element={<AddCategory />} />
          <Route path='/category/view' element={<ViewCategory />} />
          <Route path='/products' element={<ManageProduct />} />
          <Route path='/managepayments' element={<ManagePayment />} />
          <Route path='/feedback' element={<Feedback />} />
          <Route path='/viewuser' element={<ViewUser />} />
          <Route path='/updateuser/:id' element={<UpdateUser />} />
          <Route path='/' element={<Navigate to='/admin/dashboard' replace />} />
          <Route path='/booking' element={<ManageBooking />} />
        </Routes>

      </Box>
    </Box>
  )
}
export default function AdminRoute() {
  return (
    <Routes>
      <Route path='/login' element={<AdminLogin />} />
      <Route path='/*' element={<AdminLayout />} />
    </Routes>
  )
}
