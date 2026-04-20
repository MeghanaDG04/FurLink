import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Typography, Collapse, Avatar, Divider,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import CategoryIcon from '@mui/icons-material/Category'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import ViewListIcon from '@mui/icons-material/ViewList'
import LogoutIcon from '@mui/icons-material/Logout'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import InventoryIcon from '@mui/icons-material/Inventory'
import PaymentIcon from '@mui/icons-material/Payment'
import FeedbackIcon from '@mui/icons-material/Feedback'

const drawerWidth = 260

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
  { text: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
  { text: 'Products', icon: <InventoryIcon />, path: '/admin/products' },
  { text: 'Payments', icon: <PaymentIcon />, path: '/admin/managepayments' },
  { text: 'Feedback', icon: <FeedbackIcon />, path: '/admin/feedback' },
  { text: 'Booking', icon: <InventoryIcon />, path: '/admin/booking' }
]

const categoryItems = [
  { text: 'Add Category', icon: <AddCircleIcon />, path: '/admin/category/add' },
  { text: 'View Category', icon: <ViewListIcon />, path: '/admin/category/view' },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [categoryOpen, setCategoryOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn')
    navigate('/admin/login')
  }

  const isActive = (path) => location.pathname === path
  const isCategoryActive = categoryItems.some((item) => location.pathname === item.path)

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: 'linear-gradient(195deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          color: '#fff',
          borderRight: 'none',
        },
      }}
    >
      {/* Logo / Brand */}
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Avatar sx={{
          m: 'auto', mb: 1, width: 60, height: 60,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}>
          <AdminPanelSettingsIcon sx={{ fontSize: 32 }} />
        </Avatar>
        <Typography variant="h6" fontWeight={700}>Admin Panel</Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
          Management Dashboard
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* Nav Items */}
      <List sx={{ px: 1, mt: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={Link} to={item.path}
              sx={{
                borderRadius: 2, mx: 1,
                bgcolor: isActive(item.path) ? 'rgba(102,126,234,0.3)' : 'transparent',
                '&:hover': { bgcolor: 'rgba(102,126,234,0.2)' },
              }}
            >
              <ListItemIcon sx={{
                color: isActive(item.path) ? '#667eea' : 'rgba(255,255,255,0.7)',
                minWidth: 40,
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: isActive(item.path) ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}

        {/* Category with submenu */}
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            onClick={() => setCategoryOpen(!categoryOpen)}
            sx={{
              borderRadius: 2, mx: 1,
              bgcolor: isCategoryActive ? 'rgba(102,126,234,0.15)' : 'transparent',
              '&:hover': { bgcolor: 'rgba(102,126,234,0.2)' },
            }}
          >
            <ListItemIcon sx={{
              color: isCategoryActive ? '#667eea' : 'rgba(255,255,255,0.7)',
              minWidth: 40,
            }}>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText primary="Category" primaryTypographyProps={{ fontSize: '0.9rem' }} />
            {categoryOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>

        <Collapse in={categoryOpen} timeout="auto" unmountOnExit>
          <List disablePadding>
            {categoryItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link} to={item.path}
                  sx={{
                    borderRadius: 2, mx: 1, pl: 4,
                    bgcolor: isActive(item.path) ? 'rgba(102,126,234,0.3)' : 'transparent',
                    '&:hover': { bgcolor: 'rgba(102,126,234,0.2)' },
                  }}
                >
                  <ListItemIcon sx={{
                    color: isActive(item.path) ? '#667eea' : 'rgba(255,255,255,0.5)',
                    minWidth: 36,
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.85rem',
                      fontWeight: isActive(item.path) ? 600 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>
      </List>

      <Box sx={{ flexGrow: 1 }} />

      {/* Logout */}
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      <List sx={{ px: 1, pb: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2, mx: 1,
              '&:hover': { bgcolor: 'rgba(255,82,82,0.2)' },
            }}
          >
            <ListItemIcon sx={{ color: '#ff5252', minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{ fontSize: '0.9rem', color: '#ff5252' }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  )
}
