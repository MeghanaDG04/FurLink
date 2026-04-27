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
  Badge,
  Snackbar,
} from "@mui/material";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PetsIcon from "@mui/icons-material/Pets";
import VisibilityIcon from "@mui/icons-material/Visibility";

import axiosInstance from "../../../utils/axiosConfig";

const DEFAULT_IMAGE = "https://placehold.co/400x400/F1F5F9/2563EB?text=No+Image";

const PRIMARY_COLOR = "#2563EB";

const WishlistPage = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState({ products: [], pets: [] });
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await axiosInstance.get("/wishlist/");
      setWishlist(res.data.wishlist || { products: [], pets: [] });
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (itemId, type) => {
    try {
      await axiosInstance.delete("/wishlist/remove", {
        data: { itemId, type },
      });
      // Refetch
      const res = await axiosInstance.get("/wishlist/");
      setWishlist(res.data.wishlist || { products: [], pets: [] });
      setSnackbar({ open: true, message: "Removed from wishlist", severity: "success" });
    } catch (err) {
      console.error("Error removing:", err);
      setSnackbar({ open: true, message: "Failed to remove", severity: "error" });
    }
  };

  const addToCart = async (productId) => {
    try {
      await axiosInstance.post("/cart/product", { productId, quantity: 1 });
      setSnackbar({ open: true, message: "Added to cart", severity: "success" });
      // Optionally remove from wishlist
      // removeFromWishlist(productId, "product");
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to add to cart", severity: "error" });
    }
  };

  if (loading) {
    return (
      <Box sx={{ py: 4, background: "#F8FAFC", minHeight: "100vh" }}>
        <Container maxWidth="xl">
          <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
            My Wishlist
          </Typography>
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={12} sm={6} lg={3} key={i}>
                <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
                  <Box sx={{ height: 220, bgcolor: "#f0f0f0" }} />
                  <CardContent>
                    <Box sx={{ height: 24, width: "80%", bgcolor: "#f0f0f0", borderRadius: 1, mb: 1 }} />
                    <Box sx={{ height: 16, width: "50%", bgcolor: "#f0f0f0", borderRadius: 1 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    );
  }

  const totalItems = wishlist.products.length + wishlist.pets.length;

  return (
    <Box sx={{ py: 4, background: "#F8FAFC", minHeight: "100vh" }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h4" fontWeight={700}>
            My Wishlist ({totalItems} items)
          </Typography>
          <Button
            variant="outlined"
            startIcon={<VisibilityIcon />}
            onClick={() => navigate(-1)}
          >
            Continue Shopping
          </Button>
        </Box>

        {totalItems === 0 ? (
          <Paper sx={{ p: 8, textAlign: "center", borderRadius: 3 }}>
            <FavoriteBorderIcon sx={{ fontSize: 80, color: "#CBD5E1", mb: 2 }} />
            <Typography variant="h5" sx={{ color: "#64748B", mb: 2 }}>
              Your wishlist is empty
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/")}
              sx={{ borderRadius: 3, background: PRIMARY_COLOR }}
            >
              Explore Products
            </Button>
          </Paper>
        ) : (
          <>
            {/* Products Section */}
            {wishlist.products.length > 0 && (
              <Box sx={{ mb: 6 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: "#1E293B" }}>
                  Products ({wishlist.products.length})
                </Typography>
                <Grid container spacing={3}>
                  {wishlist.products.map((product) => (
                    <Grid item xs={12} sm={6} lg={3} key={product._id}>
                      <Card
                        sx={{
                          borderRadius: 3,
                          overflow: "hidden",
                          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                          background: "#fff",
                          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                          "&:hover": {
                            transform: "translateY(-8px)",
                            boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                          },
                        }}
                      >
                        <Box sx={{ position: "relative", overflow: "hidden" }}>
                          <CardMedia
                            component="img"
                            height="220"
                            image={
                              product.productimage
                                ? `http://localhost:7000/image/${product.productimage}`
                                : DEFAULT_IMAGE
                            }
                            alt={product.name}
                            sx={{ objectFit: "cover", cursor: "pointer" }}
                            onClick={() => navigate(`/viewsingleproduct/${product._id}`)}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              top: 10,
                              right: 10,
                              display: "flex",
                              flexDirection: "column",
                              gap: 1,
                            }}
                          >
                            <IconButton
                              sx={{ bgcolor: "#fff", color: "#EF4444" }}
                              onClick={() => removeFromWishlist(product._id, "product")}
                            >
                              <FavoriteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                        <CardContent sx={{ p: 2 }}>
                          <Typography
                            fontWeight={600}
                            noWrap
                            sx={{
                              color: "#1E293B",
                              fontSize: "1rem",
                              cursor: "pointer",
                              "&:hover": { color: PRIMARY_COLOR },
                            }}
                            onClick={() => navigate(`/viewsingleproduct/${product._id}`)}
                          >
                            {product.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            ₹{product.price}
                          </Typography>
                          <Button
                            fullWidth
                            variant="contained"
                            startIcon={<ShoppingCartIcon />}
                            onClick={() => addToCart(product._id)}
                            sx={{
                              mt: 2,
                              borderRadius: 3,
                              textTransform: "none",
                              fontWeight: 600,
                              background: PRIMARY_COLOR,
                            }}
                          >
                            Add to Cart
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Pets Section */}
            {wishlist.pets.length > 0 && (
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: "#1E293B" }}>
                  Pets ({wishlist.pets.length})
                </Typography>
                <Grid container spacing={3}>
                  {wishlist.pets.map((pet) => (
                    <Grid item xs={12} sm={6} lg={3} key={pet._id}>
                      <Card
                        sx={{
                          borderRadius: 3,
                          overflow: "hidden",
                          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                          background: "#fff",
                          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                          "&:hover": {
                            transform: "translateY(-8px)",
                            boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                          },
                        }}
                      >
                        <Box sx={{ position: "relative", overflow: "hidden" }}>
                          <CardMedia
                            component="img"
                            height="220"
                            image={pet.image ? `http://localhost:7000${pet.image}` : DEFAULT_IMAGE}
                            alt={pet.name}
                            sx={{ objectFit: "cover", cursor: "pointer" }}
                            onClick={() => navigate(`/adopt/pet/${pet._id}`)}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              top: 10,
                              right: 10,
                              display: "flex",
                              flexDirection: "column",
                              gap: 1,
                            }}
                          >
                            <IconButton
                              sx={{ bgcolor: "#fff", color: "#EF4444" }}
                              onClick={() => removeFromWishlist(pet._id, "pet")}
                            >
                              <FavoriteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                        <CardContent sx={{ p: 2 }}>
                          <Typography
                            fontWeight={600}
                            noWrap
                            sx={{
                              color: "#1E293B",
                              fontSize: "1rem",
                              cursor: "pointer",
                              "&:hover": { color: PRIMARY_COLOR },
                            }}
                            onClick={() => navigate(`/adopt/pet/${pet._id}`)}
                          >
                            {pet.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {pet.breed || "Unknown"} • {pet.age} yrs • {pet.gender}
                          </Typography>
                          <Button
                            fullWidth
                            variant="contained"
                            startIcon={<PetsIcon />}
                            onClick={() => navigate(`/adopt/pet/${pet._id}`)}
                            sx={{
                              mt: 2,
                              borderRadius: 3,
                              textTransform: "none",
                              fontWeight: 600,
                              background: PRIMARY_COLOR,
                            }}
                          >
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </>
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

export default WishlistPage;
