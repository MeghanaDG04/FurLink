import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Paper, Box, Grid, Avatar, Button, IconButton,
  CircularProgress, Card, CardMedia, CardContent, CardActions,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PetsIcon from '@mui/icons-material/Pets';
import DeleteIcon from '@mui/icons-material/Delete';

const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .wishlist-card:hover {
    box-shadow: 0 4px 20px rgba(255,107,107,0.15);
    transform: translateY(-2px);
  }
`;
document.head.appendChild(styleSheet);

export default function WishList() {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const fetchWishlistItems = async () => {
    const token = localStorage.getItem('Token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const res = await fetch('http://localhost:7000/wishlist/', {
        headers: { 'auth-token': token }
      });
      const data = await res.json();
      setWishlistItems(data.wishlistItems || []);
    } catch (err) {
      console.log('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (itemId) => {
    setRemoving(itemId);
    const token = localStorage.getItem('Token');

    try {
      const res = await fetch(`http://localhost:7000/wishlist/remove/${itemId}`, {
        method: 'DELETE',
        headers: { 'auth-token': token }
      });

      if (res.ok) {
        setWishlistItems(wishlistItems.filter(item => item._id !== itemId));
      }
    } catch (err) {
      console.log('Error removing from wishlist:', err);
    } finally {
      setRemoving(null);
    }
  };

  const addToCart = async (productId) => {
    const token = localStorage.getItem('Token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const res = await fetch('http://localhost:7000/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify({ productId, quantity: 1 })
      });

      if (res.ok) {
        alert('Added to cart!');
      }
    } catch (err) {
      console.log('Error adding to cart:', err);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#FF6B6B' }} />
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
            '&:hover': { background: '#ffe8e8' }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Avatar sx={{ mr: 1.5, bgcolor: '#FF6B6B' }}>
          <FavoriteIcon />
        </Avatar>
        <Typography variant="h5" fontWeight={700} sx={{ 
          background: 'linear-gradient(135deg, #FF6B6B, #FF9A56)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          My Wishlist
        </Typography>
      </Box>

      {wishlistItems.length === 0 ? (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: '#ffe8e8', width: 80, height: 80 }}>
            <FavoriteIcon sx={{ fontSize: 40, color: '#FF6B6B' }} />
          </Avatar>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Your wishlist is empty
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Save items you love to your wishlist to see them here.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/homepage')}
            sx={{
              background: 'linear-gradient(135deg, #FF6B6B 0%, #FF9A56 100%)',
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              py: 1,
              '&:hover': {
                background: 'linear-gradient(135deg, #FF5252 0%, #FF8C42 100%)'
              }
            }}
          >
            Start Shopping
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {wishlistItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <Paper
                elevation={1}
                className="wishlist-card"
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box
                  sx={{
                    height: 180,
                    overflow: 'hidden',
                    position: 'relative',
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
                    <Avatar sx={{ width: '100%', height: '100%', bgcolor: '#ffe8e8' }}>
                      <PetsIcon sx={{ fontSize: 60, color: '#FF6B6B' }} />
                    </Avatar>
                  )}
                  <IconButton
                    onClick={() => removeFromWishlist(item._id)}
                    disabled={removing === item._id}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(255,255,255,0.9)',
                      '&:hover': { bgcolor: '#fff', color: '#FF6B6B' },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>

                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
                    {item.productID?.name || 'Product'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, flex: 1 }}>
                    {item.productID?.description?.substring(0, 60) || 'No description'}...
                  </Typography>
                  <Typography variant="h6" fontWeight={700} sx={{ color: '#FF6B6B', mb: 2 }}>
                    ₹{item.productID?.price || 0}
                  </Typography>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => addToCart(item.productID?._id)}
                    sx={{
                      background: 'linear-gradient(135deg, #FF6B6B 0%, #FF9A56 100%)',
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #FF5252 0%, #FF8C42 100%)'
                      }
                    }}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}