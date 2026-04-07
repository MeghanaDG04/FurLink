import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Grid,
  Typography,
  CardMedia,
  Box,
  Chip,
  Button,
  Paper,
  IconButton
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingCartOutlined from "@mui/icons-material/ShoppingCartOutlined";

export default function ViewSingleProduct() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  const fetchSingleProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:7000/product/getsingleproduct/${id}`);
      setProduct(res.data.pdata);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSingleProduct();
  }, [id]);

  if (!product) {
    return (
      <Typography textAlign="center" mt={5}>
        Loading product details...
      </Typography>
    );
  }

  return (
  <Container maxWidth="lg" sx={{ py: 5 }}>

    {/* BACK */}
    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
      <IconButton
        onClick={() => navigate(-1)}
        sx={{
          mb: 2,
          background: "#f5f5f5",
          "&:hover": { background: "#e0e0e0" }
        }}
      >
        <ArrowBackIcon />
      </IconButton>
    </Box>

    <Paper
      elevation={4}
      sx={{
        p: 4,
        borderRadius: 5,
        background: "#ffffff",
      }}
    >
      <Grid container spacing={5} alignItems="center">

        {/* IMAGE */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              overflow: "hidden",
              borderRadius: 4,
              background: "#f8fafc",
              p: 2
            }}
          >
            <CardMedia
              component="img"
              height="420"
              image={
                product.productimage
                  ? `http://localhost:7000/image/${product.productimage}`
                  : "/fallback.jpg"
              }
              alt={product.name}
              sx={{
                borderRadius: 3,
                transition: "0.4s",
                objectFit: "contain",
                "&:hover": {
                  transform: "scale(1.06)"
                }
              }}
            />
          </Box>
        </Grid>

        {/* DETAILS */}
        <Grid item xs={12} md={6}>

          {/* CATEGORY + DISCOUNT */}
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <Chip
              label={product.category?.category || "General"}
              color="secondary"
              sx={{ fontWeight: 600 }}
            />
            {/* <Chip
              label="20% OFF"
              color="success"
              sx={{ fontWeight: 600 }}
            /> */}
          </Box>

          {/* NAME */}
          <Typography variant="h4" fontWeight={700}>
            {product.name}
          </Typography>

          {/* RATING */}
          <Typography sx={{ mt: 1, color: "#f59e0b" }}>
            ★★★★☆ <span style={{ color: "#555" }}>(120 reviews)</span>
          </Typography>

          {/* PRICE */}
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="h5"
              sx={{ color: "#1976d2", fontWeight: 700 }}
            >
              ₹{product.price}
            </Typography>

            {/* <Typography
              variant="body2"
              sx={{ textDecoration: "line-through", color: "gray" }}
            >
              ₹{product.price + 500}
            </Typography> */}
          </Box>

          {/* DESCRIPTION */}
          <Typography
            sx={{
              mt: 2,
              color: "text.secondary",
              lineHeight: 1.8
            }}
          >
            {product.description}
          </Typography>

          {/* STOCK STATUS */}
          <Typography
            sx={{
              mt: 2,
              fontWeight: 600,
              color: product.quantity > 0 ? "green" : "red"
            }}
          >
            {product.quantity > 0
              ? `In Stock (${product.quantity} available)`
              : "Out of Stock"}
          </Typography>

          {/* BUTTONS */}
          <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<ShoppingCartOutlined />}
              sx={{
                flex: 1,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 600,
                textTransform: "none",
                background: "linear-gradient(135deg, #667eea, #764ba2)",
              }}
            >
              Add to Cart
            </Button>

            <Button
              variant="outlined"
              sx={{
                flex: 1,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              Buy Now
            </Button>
          </Box>

        </Grid>
      </Grid>
    </Paper>
  </Container>
);
}