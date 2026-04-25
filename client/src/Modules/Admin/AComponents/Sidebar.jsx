import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Typography, Collapse, Avatar, Divider,
} from '@mui/material'
import Pets from '@mui/icons-material/Pets'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import CategoryIcon from '@mui/icons-material/Category'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import ViewListIcon from '@mui/icons-material/ViewList'
import LogoutIcon from '@mui/icons-material/Logout'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import InventoryIcon from '@mui/icons-material/Inventory'
import PaymentIcon from '@mui/icons-material/Payment'
import FeedbackIcon from '@mui/icons-material/Feedback'
import FavoriteIcon from '@mui/icons-material/Favorite'

const drawerWidth = 260

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
  { text: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
  { text: 'Products', icon: <InventoryIcon />, path: '/admin/products' },
  { text: 'Payments', icon: <PaymentIcon />, path: '/admin/managepayments' },
  { text: 'Feedback', icon: <FeedbackIcon />, path: '/admin/feedback' },
  { text: 'Booking', icon: <InventoryIcon />, path: '/admin/booking' },
  {text: "Pets", icon: <Pets />, path: '/admin/pets'},
  { text: 'Adopt', icon: <FavoriteIcon />, path: '/admin/adopt' }
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
    localStorage.removeItem('adminInfo')
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
          background: 'linear-gradient(195deg, rgba(255,255,255,0.98) 0%, rgba(232,244,253,0.95) 100%)',
          color: '#333',
          borderRight: '1px solid rgba(124,185,232,0.15)',
          boxShadow: '2px 0 20px rgba(124,185,232,0.1)',
        },
      }}
    >
      {/* Logo / Brand */}
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Avatar sx={{
          m: 'auto', mb: 1, width: 60, height: 60,
          background: 'linear-gradient(135deg, #7CB9E8 0%, #A8D8EA 100%)',
          boxShadow: '0 4px 12px rgba(124,185,232,0.3)',
        }}>
          <Pets sx={{ fontSize: 32, color: '#fff' }} />
        </Avatar>
        <Typography variant="h6" fontWeight={800} sx={{ 
          background: 'linear-gradient(135deg, #7CB9E8, #FF9A56)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          FurLink Admin
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.5)' }}>
          Management Dashboard
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(124,185,232,0.15)' }} />

      {/* Nav Items */}
      <List sx={{ px: 1, mt: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={Link} to={item.path}
              sx={{
                borderRadius: 2, mx: 1,
                bgcolor: isActive(item.path) ? 'rgba(124,185,232,0.15)' : 'transparent',
                '&:hover': { bgcolor: 'rgba(124,185,232,0.1)' },
              }}
            >
              <ListItemIcon sx={{
                color: isActive(item.path) ? '#7CB9E8' : 'rgba(0,0,0,0.6)',
                minWidth: 40,
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: isActive(item.path) ? 700 : 500,
                  color: isActive(item.path) ? '#7CB9E8' : 'rgba(0,0,0,0.7)',
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
              bgcolor: isCategoryActive ? 'rgba(124,185,232,0.15)' : 'transparent',
              '&:hover': { bgcolor: 'rgba(124,185,232,0.1)' },
            }}
          >
            <ListItemIcon sx={{
              color: isCategoryActive ? '#7CB9E8' : 'rgba(0,0,0,0.6)',
              minWidth: 40,
            }}>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Category" 
              primaryTypographyProps={{ 
                fontSize: '0.9rem',
                fontWeight: isCategoryActive ? 700 : 500,
                color: isCategoryActive ? '#7CB9E8' : 'rgba(0,0,0,0.7)',
              }} 
            />
            {categoryOpen ? <ExpandLess sx={{ color: '#7CB9E8' }} /> : <ExpandMore sx={{ color: 'rgba(0,0,0,0.5)' }} />}
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
                    bgcolor: isActive(item.path) ? 'rgba(124,185,232,0.15)' : 'transparent',
                    '&:hover': { bgcolor: 'rgba(124,185,232,0.1)' },
                  }}
                >
                  <ListItemIcon sx={{
                    color: isActive(item.path) ? '#7CB9E8' : 'rgba(0,0,0,0.5)',
                    minWidth: 36,
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.85rem',
                      fontWeight: isActive(item.path) ? 700 : 500,
                      color: isActive(item.path) ? '#7CB9E8' : 'rgba(0,0,0,0.7)',
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
      <Divider sx={{ borderColor: 'rgba(124,185,232,0.15)' }} />
      <List sx={{ px: 1, pb: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2, mx: 1,
              '&:hover': { bgcolor: 'rgba(255,107,107,0.1)' },
            }}
          >
            <ListItemIcon sx={{ color: '#FF6B6B', minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{ fontSize: '0.9rem', color: '#FF6B6B', fontWeight: 600 }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  )
}
