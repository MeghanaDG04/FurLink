import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Paper, Box, Grid, Avatar, Button, IconButton,
  CircularProgress, Divider, Card, CardMedia, CardContent, CardActions,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import PetsIcon from '@mui/icons-material/Pets';

const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .cart-card:hover {
    box-shadow: 0 4px 20px rgba(124,185,232,0.2);
    transform: translateY(-2px);
  }
  .qty-btn:hover { background: rgba(124,185,232,0.1); }
`;
document.head.appendChild(styleSheet);

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    const token = localStorage.getItem('Token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const res = await fetch('http://localhost:7000/cart/', {
        headers: { 'auth-token': token }
      });
      const data = await res.json();
      setCartItems(data.cartItems || []);
    } catch (err) {
      console.log('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, change) => {
    const item = cartItems.find(i => i._id === itemId);
    if (!item) return;

    const newQty = item.quantity + change;
    if (newQty < 1) return;

    setUpdating(itemId);
    const token = localStorage.getItem('Token');

    try {
      const res = await fetch(`http://localhost:7000/cart/update/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify({ quantity: newQty })
      });

      if (res.ok) {
        setCartItems(cartItems.map(cartItem =>
          cartItem._id === itemId ? { ...cartItem, quantity: newQty } : cartItem
        ));
      }
    } catch (err) {
      console.log('Error updating quantity:', err);
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (itemId) => {
    setUpdating(itemId);
    const token = localStorage.getItem('Token');

    try {
      const res = await fetch(`http://localhost:7000/cart/remove/${itemId}`, {
        method: 'DELETE',
        headers: { 'auth-token': token }
      });

      if (res.ok) {
        setCartItems(cartItems.filter(item => item._id !== itemId));
      }
    } catch (err) {
      console.log('Error removing item:', err);
    } finally {
      setUpdating(null);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.productID?.price || 0) * item.quantity;
    }, 0);
  };

  const handleCheckout = () => {
    navigate('/bookingform');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#7CB9E8' }} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            mr: 1,
            background: '#f5f5f5',
            '&:hover': { background: '#e8f4fc' }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Avatar sx={{ mr: 1.5, bgcolor: '#7CB9E8' }}>
          <ShoppingCartIcon />
        </Avatar>
        <Typography variant="h5" fontWeight={700} sx={{ 
          background: 'linear-gradient(135deg, #7CB9E8, #FF9A56)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          My Cart
        </Typography>
      </Box>

      {cartItems.length === 0 ? (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: '#e8f4fc', width: 80, height: 80 }}>
            <ShoppingCartIcon sx={{ fontSize: 40, color: '#7CB9E8' }} />
          </Avatar>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Your cart is empty
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Add items to your cart to see them here.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/homepage')}
            sx={{
              background: 'linear-gradient(135deg, #7CB9E8 0%, #A8D8EA 100%)',
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              py: 1,
              '&:hover': {
                background: 'linear-gradient(135deg, #5BA8D8 0%, #98C8E0 100%)'
              }
            }}
          >
            Start Shopping
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {cartItems.map((item) => (
                <Paper
                  key={item._id}
                  elevation={1}
                  className="cart-card"
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Box sx={{ display: 'flex', p: 2, gap: 2 }}>
                    <Box
                      sx={{
                        width: 120,
                        height: 120,
                        borderRadius: 2,
                        overflow: 'hidden',
                        flexShrink: 0,
                        bgcolor: '#f5f5f5',
                      }}
                    >
                      {item.productID?.image ? (
                        <img
                          src={`http://localhost:7000/uploads/${item.productID.image}`}
                          alt={item.productID?.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <Avatar sx={{ width: '100%', height: '100%', bgcolor: '#e8f4fc' }}>
                          <PetsIcon sx={{ fontSize: 40, color: '#7CB9E8' }} />
                        </Avatar>
                      )}
                    </Box>

                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
                          {item.productID?.name || 'Product'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {item.productID?.description?.substring(0, 80) || 'No description'}...
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton
                            className="qty-btn"
                            onClick={() => updateQuantity(item._id, -1)}
                            disabled={updating === item._id || item.quantity <= 1}
                            sx={{ borderRadius: 1, border: '1px solid #ddd' }}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography sx={{ minWidth: 30, textAlign: 'center', fontWeight: 600 }}>
                            {item.quantity}
                          </Typography>
                          <IconButton
                            className="qty-btn"
                            onClick={() => updateQuantity(item._id, 1)}
                            disabled={updating === item._id}
                            sx={{ borderRadius: 1, border: '1px solid #ddd' }}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>

                        <Typography variant="h6" fontWeight={700} sx={{ color: '#7CB9E8' }}>
                          ₹{(item.productID?.price || 0) * item.quantity}
                        </Typography>
                      </Box>
                    </Box>

                    <IconButton
                      onClick={() => removeItem(item._id)}
                      disabled={updating === item._id}
                      sx={{ color: '#FF6B6B', alignSelf: 'flex-start' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 80 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Order Summary
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography color="text.secondary">Items ({cartItems.length})</Typography>
                  <Typography fontWeight={600}>₹{calculateTotal()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography color="text.secondary">Shipping</Typography>
                  <Typography fontWeight={600} color="success.main">Free</Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" fontWeight={700}>Total</Typography>
                <Typography variant="h5" fontWeight={700} sx={{ color: '#7CB9E8' }}>
                  ₹{calculateTotal()}
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                onClick={handleCheckout}
                sx={{
                  background: 'linear-gradient(135deg, #7CB9E8 0%, #FF9A56 100%)',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 700,
                  py: 1.5,
                  fontSize: '1rem',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5BA8D8 0%, #FF8C42 100%)'
                  }
                }}
              >
                Proceed to Checkout
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/homepage')}
                sx={{
                  mt: 1,
                  borderColor: '#7CB9E8',
                  color: '#7CB9E8',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': { borderColor: '#5BA8D8', bgcolor: 'rgba(124,185,232,0.05)' }
                }}
              >
                Continue Shopping
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}