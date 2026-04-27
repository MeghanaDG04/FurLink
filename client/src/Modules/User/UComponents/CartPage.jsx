import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Paper,
  IconButton,
  Alert,
  Snackbar,
  TextField,
  Divider,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PetsIcon from "@mui/icons-material/Pets";
import VisibilityIcon from "@mui/icons-material/Visibility";

import axiosInstance from "../../../utils/axiosConfig";

const DEFAULT_IMAGE = "https://placehold.co/400x400/F1F5F9/2563EB?text=No+Image";

const PRIMARY_COLOR = "#2563EB";

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axiosInstance.get("/cart/");
      setCart(res.data.cart || { items: [], totalPrice: 0 });
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await axiosInstance.put("/cart/update", { itemId, quantity: newQuantity });
      const res = await axiosInstance.get("/cart/");
      setCart(res.data.cart || { items: [], totalPrice: 0 });
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to update quantity", severity: "error" });
    }
  };

  const removeItem = async (itemId) => {
    try {
      await axiosInstance.delete("/cart/remove", { data: { itemId } });
      const res = await axiosInstance.get("/cart/");
      setCart(res.data.cart || { items: [], totalPrice: 0 });
      setSnackbar({ open: true, message: "Item removed", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to remove item", severity: "error" });
    }
  };

  const clearCart = async () => {
    try {
      await axiosInstance.delete("/cart/clear");
      setCart({ items: [], totalPrice: 0 });
      setSnackbar({ open: true, message: "Cart cleared", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to clear cart", severity: "error" });
    }
  };

  if (loading) {
    return (
      <Box sx={{ py: 4, background: "#F8FAFC", minHeight: "100vh" }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
            Shopping Cart
          </Typography>
          {[1, 2].map((i) => (
            <Paper key={i} sx={{ p: 3, mb: 2, borderRadius: 3 }}>
              <Box sx={{ display: "flex", gap: 3 }}>
                <Box sx={{ width: 120, height: 120, bgcolor: "#f0f0f0", borderRadius: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ height: 24, width: "60%", bgcolor: "#f0f0f0", borderRadius: 1, mb: 2 }} />
                  <Box sx={{ height: 20, width: "40%", bgcolor: "#f0f0f0", borderRadius: 1 }} />
                </Box>
              </Box>
            </Paper>
          ))}
        </Container>
      </Box>
    );
  }

  const totalItems = cart.items.length;
  const totalPrice = cart.items.reduce((sum, item) => {
    const price = item.product?.price || item.pet?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <Box sx={{ py: 4, background: "#F8FAFC", minHeight: "100vh" }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h4" fontWeight={700}>
            Shopping Cart ({totalItems} items)
          </Typography>
          {totalItems > 0 && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={clearCart}
            >
              Clear Cart
            </Button>
          )}
        </Box>

        {totalItems === 0 ? (
          <Paper sx={{ p: 8, textAlign: "center", borderRadius: 3 }}>
            <ShoppingCartIcon sx={{ fontSize: 80, color: "#CBD5E1", mb: 2 }} />
            <Typography variant="h5" sx={{ color: "#64748B", mb: 2 }}>
              Your cart is empty
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/")}
              sx={{ borderRadius: 3, background: PRIMARY_COLOR }}
            >
              Start Shopping
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {/* Cart Items */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
                {cart.items.map((item, index) => {
                  const isProduct = !!item.product;
                  const itemData = isProduct ? item.product : item.pet;
                  const itemId = isProduct ? item.product._id : item.pet._id;
                  const image = isProduct
                    ? item.product?.productimage
                      ? `http://localhost:7000/image/${item.product.productimage}`
                      : DEFAULT_IMAGE
                    : item.pet?.image
                    ? `http://localhost:7000${item.pet.image}`
                    : DEFAULT_IMAGE;

                  return (
                    <Box key={item._id}>
                      {index > 0 && <Divider />}
                      <Box sx={{ p: 3, display: "flex", gap: 3, alignItems: "center" }}>
                        <CardMedia
                          component="img"
                          sx={{
                            width: 120,
                            height: 120,
                            objectFit: "cover",
                            borderRadius: 2,
                            cursor: "pointer",
                          }}
                          image={image}
                          alt={itemData?.name}
                          onClick={() => navigate(isProduct ? `/viewsingleproduct/${itemId}` : `/adopt/pet/${itemId}`)}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            fontWeight={600}
                            sx={{ color: "#1E293B", fontSize: "1.1rem", cursor: "pointer" }}
                            onClick={() => navigate(isProduct ? `/viewsingleproduct/${itemId}` : `/adopt/pet/${itemId}`)}
                          >
                            {itemData?.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {isProduct ? `₹${itemData?.price}` : `${itemData?.age} yrs • ${itemData?.gender}`}
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              sx={{ border: "1px solid #E2E8F0" }}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            <TextField
                              size="small"
                              value={item.quantity}
                              InputProps={{ readOnly: true }}
                              sx={{ width: 60, textAlign: "center" }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              sx={{ border: "1px solid #E2E8F0" }}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                        <Box sx={{ textAlign: "right" }}>
                          <Typography fontWeight={700} color={PRIMARY_COLOR} sx={{ fontSize: "1.2rem" }}>
                            ₹{(item.product?.price || 0) * item.quantity}
                          </Typography>
                          <IconButton
                            sx={{ mt: 1, color: "#EF4444" }}
                            onClick={() => removeItem(item._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  );
                })}
              </Paper>
            </Grid>

            {/* Order Summary */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, borderRadius: 3, position: "sticky", top: 90 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  Order Summary
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Typography color="text.secondary">Subtotal</Typography>
                  <Typography fontWeight={600}>₹{totalPrice}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Typography color="text.secondary">Shipping</Typography>
                  <Typography fontWeight={600}>Free</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                  <Typography variant="h6" fontWeight={700}>
                    Total
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color={PRIMARY_COLOR}>
                    ₹{totalPrice}
                  </Typography>
                </Box>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => navigate("/checkout")}
                  sx={{
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 600,
                    background: PRIMARY_COLOR,
                    boxShadow: `0 4px 14px ${PRIMARY_COLOR}40`,
                    "&:hover": {
                      background: "#1D4ED8",
                      boxShadow: `0 6px 20px ${PRIMARY_COLOR}40`,
                    },
                  }}
                >
                  Proceed to Checkout
                </Button>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CartPage;
