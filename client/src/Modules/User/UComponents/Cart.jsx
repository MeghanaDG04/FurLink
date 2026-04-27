import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Paper, Box, Grid, Avatar, Button, IconButton,
  CircularProgress, Divider, Card, CardMedia, CardContent, CardActions,
  Snackbar, Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import PetsIcon from '@mui/icons-material/Pets';
import axiosInstance from "../../../utils/axiosConfig";

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

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
      const res = await axiosInstance.get('/cart/');
      setCartItems(res.data.cart?.items || []);
    } catch (err) {
      console.log('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdating(itemId);
    try {
      await axiosInstance.put('/cart/update', { itemId, quantity: newQuantity });
      const res = await axiosInstance.get('/cart/');
      setCartItems(res.data.cart?.items || []);
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to update quantity", severity: "error" });
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (itemId) => {
    setUpdating(itemId);
    try {
      await axiosInstance.delete('/cart/remove', { data: { itemId } });
      const res = await axiosInstance.get('/cart/');
      setCartItems(res.data.cart?.items || []);
      setSnackbar({ open: true, message: "Item removed", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to remove item", severity: "error" });
    } finally {
      setUpdating(null);
    }
  };

  const clearCart = async () => {
    try {
      await axiosInstance.delete('/cart/clear');
      setCartItems([]);
      setSnackbar({ open: true, message: "Cart cleared", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to clear cart", severity: "error" });
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product?.price || item.pet?.price || 0;
      return total + price * item.quantity;
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
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 1, background: '#f5f5f5', '&:hover': { background: '#e8f4fc' } }}>
          <ArrowBackIcon />
        </IconButton>
        <Avatar sx={{ mr: 1.5, bgcolor: '#7CB9E8' }}>
          <ShoppingCartIcon />
        </Avatar>
        <Typography variant="h5" fontWeight={700} sx={{ background: 'linear-gradient(135deg, #7CB9E8, #FF9A56)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          My Cart
        </Typography>
      </Box>

      {cartItems.length === 0 ? (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: '#e8f4fc', width: 80, height: 80 }}>
            <ShoppingCartIcon sx={{ fontSize: 40, color: '#7CB9E8' }} />
          </Avatar>
          <Typography variant="h6" sx={{ mb: 1 }}>Your cart is empty</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Add items to your cart to see them here.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/homepage')} sx={{ background: 'linear-gradient(135deg, #7CB9E8 0%, #A8D8EA 100%)', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 4, py: 1, '&:hover': { background: 'linear-gradient(135deg, #5BA8D8 0%, #98C8E0 100%)' } }}>
            Start Shopping
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {cartItems.map((item, index) => {
                const isProduct = !!item.product;
                const itemData = isProduct ? item.product : item.pet;
                const itemId = isProduct ? item.product._id : item.pet._id;
                const image = isProduct
                  ? item.product?.productimage
                    ? `http://localhost:7000/image/${item.product.productimage}`
                    : "https://placehold.co/400x400/F1F5F9/2563EB?text=No+Image"
                  : item.pet?.image
                  ? `http://localhost:7000${item.pet.image}`
                  : "https://placehold.co/400x400/F1F5F9/2563EB?text=No+Image";

                return (
                  <Paper key={item._id} elevation={1} sx={{ borderRadius: 3, overflow: 'hidden', transition: 'all 0.3s ease' }}>
                    {index > 0 && <Divider />}
                    <Box sx={{ p: 3, display: 'flex', gap: 3, alignItems: 'center' }}>
                      <CardMedia component="img" sx={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 2, cursor: 'pointer' }} image={image} alt={itemData?.name} onClick={() => navigate(isProduct ? `/viewsingleproduct/${itemId}` : `/adopt/pet/${itemId}`)} />
                      <Box sx={{ flex: 1 }}>
                        <Typography fontWeight={600} sx={{ color: "#1E293B", fontSize: "1.1rem", cursor: 'pointer' }} onClick={() => navigate(isProduct ? `/viewsingleproduct/${itemId}` : `/adopt/pet/${itemId}`)}>
                          {itemData?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {isProduct ? `₹${itemData?.price}` : `${itemData?.age} yrs • ${itemData?.gender}`}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton size="small" onClick={() => updateQuantity(item._id, item.quantity - 1)} disabled={updating === item._id || item.quantity <= 1} sx={{ borderRadius: 1, border: '1px solid #ddd' }}>
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <TextField size="small" value={item.quantity} InputProps={{ readOnly: true }} sx={{ width: 60, textAlign: 'center' }} />
                          <IconButton size="small" onClick={() => updateQuantity(item._id, item.quantity + 1)} disabled={updating === item._id} sx={{ borderRadius: 1, border: '1px solid #ddd' }}>
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography fontWeight={700} color="#2563EB" sx={{ fontSize: "1.2rem" }}>
                          ₹{(item.product?.price || 0) * item.quantity}
                        </Typography>
                        <IconButton sx={{ mt: 1, color: '#EF4444' }} onClick={() => removeItem(item._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </Paper>
                );
              })}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 90 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Order Summary</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}><Typography color="text.secondary">Subtotal</Typography><Typography fontWeight={600}>₹{calculateTotal()}</Typography></Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}><Typography color="text.secondary">Shipping</Typography><Typography fontWeight={600}>Free</Typography></Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" fontWeight={700}>Total</Typography>
                <Typography variant="h6" fontWeight={700} color="#2563EB">₹{calculateTotal()}</Typography>
              </Box>
              <Button fullWidth variant="contained" size="large" startIcon={<ShoppingCartIcon />} onClick={handleCheckout} sx={{ borderRadius: 3, textTransform: "none", fontWeight: 600, background: "#2563EB", boxShadow: `0 4px 14px #2563EB40`, "&:hover": { background: "#1D4ED8", boxShadow: `0 6px 20px #2563EB40` } }}>
                Proceed to Checkout
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}
