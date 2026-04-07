import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Chip,
  Button,
  Container,
  Paper,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import Inventory2Outlined from "@mui/icons-material/Inventory2Outlined";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedIcon from "@mui/icons-material/Verified";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";

import axios from "axios";
import img4 from "./img4.jpg";

export default function UserHomeProducts() {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [favorites, setFavorites] = useState([]);

  const navigate = useNavigate();
  const defaultImage = img4;

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:7000/product/getproducts");
      setProducts(res.data.pdata || []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:7000/category/getCategory");
      setCategories(res.data.cdata || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const filteredProducts = products.filter((p) => {
    const name = p?.name?.toLowerCase() || "";
    const catName = p?.category?.category?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();

    return (
      (name.includes(search) || catName.includes(search)) &&
      (selectedCategory === "All" || p?.category?._id === selectedCategory)
    );
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortBy) {
      case "price-low": return a.price - b.price;
      case "price-high": return b.price - a.price;
      case "name": return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  const highlights = [
    { icon: <LocalShippingIcon />, title: "Free Shipping", desc: "On orders over ₹499" },
    { icon: <VerifiedIcon />, title: "100% Authentic", desc: "Verified products only" },
    { icon: <LocalOfferIcon />, title: "Best Deals", desc: "Up to 70% off daily" },
    { icon: <TrendingUpIcon />, title: "Trending", desc: "Top picks for you" },
  ];

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(180deg, #E8F4FD 0%, #FFF5EE 50%, #FFF9F0 100%)" }}>

      {/* HEADER BANNER - Like About Page */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #7CB9E8 0%, #A8D8EA 100%)",
          py: { xs: 5, md: 8 },
          px: 3,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative Circles */}
        <Box sx={{ position: "absolute", top: "5%", left: "10%", width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
        <Box sx={{ position: "absolute", bottom: "10%", right: "5%", width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        
        <Typography
          variant="h2"
          fontWeight={800}
          sx={{
            color: "#fff",
            fontSize: { xs: "2rem", md: "3.5rem" },
            letterSpacing: "-0.02em",
            textShadow: "0 2px 4px rgba(0,0,0,0.15)",
          }}
        >
          Welcome to Our Shop
        </Typography>

        <Typography 
          variant="h6" 
          sx={{ 
            color: "rgba(0, 0, 0, 0.8)", 
            mt: 1,
            fontWeight: 500,
          }}
        >
          Find everything you need in one place
        </Typography>

        {/* SEARCH BAR */}
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 1.5, 
              borderRadius: 4,
              background: "#fff",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <SearchIcon sx={{ color: "#7CB9E8", fontSize: 28 }} />
            <TextField
              fullWidth
              placeholder="Search for products, brands, categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="standard"
              sx={{ 
                "& .MuiInput-input": {
                  fontSize: "1.1rem",
                  fontWeight: 500,
                }
              }}
              InputProps={{
                disableUnderline: true,
              }}
            />
            {searchTerm && (
              <Button 
                size="small" 
                onClick={() => setSearchTerm("")}
                sx={{ color: "#7CB9E8" }}
              >
                Clear
              </Button>
            )}
          </Paper>
        </Container>
      </Box>

      {/* HIGHLIGHTS - Vibrant Colors */}
      <Container maxWidth="lg" sx={{ mt: -3, position: "relative", zIndex: 2 }}>
        <Grid container spacing={2}>
          {highlights.map((item, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: ["linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)", "linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)", "linear-gradient(135deg, #7CB9E8 0%, #A8D8EA 100%)", "linear-gradient(135deg, #9C27B0 0%, #E040FB 100%)"][index],
                  color: "#fff",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
                  },
                }}
              >
                {item.icon}
                <Typography fontWeight={700} sx={{ fontSize: "0.9rem", mt: 0.5 }}>
                  {item.title}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  {item.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Container maxWidth="lg" sx={{ py: 4 }}>

        {/* TOOLBAR */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 2, 
            borderRadius: 4,
            mb: 3,
            background: "#fff",
            border: "1px solid rgba(124, 185, 232, 0.2)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FilterListIcon sx={{ color: "#7CB9E8" }} />
            <Typography fontWeight={600} sx={{ color: "#2D3748" }}>
              {sortedProducts.length} Products
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
            {/* Category Filter */}
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel sx={{ color: "#2D3748" }}>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={(e) => setSelectedCategory(e.target.value)}
                sx={{ 
                  borderRadius: 3,
                  color: "#2D3748",
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(124, 185, 232, 0.5)" }
                }}
              >
                <MenuItem value="All">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Sort Filter */}
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel sx={{ color: "#2D3748" }}>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
                sx={{ 
                  borderRadius: 3,
                  color: "#2D3748",
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(124, 185, 232, 0.5)" }
                }}
              >
                <MenuItem value="featured">Featured</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
                <MenuItem value="name">Name</MenuItem>
              </Select>
            </FormControl>

            {/* Clear Filters */}
            {(searchTerm || selectedCategory !== "All") && (
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
                sx={{ 
                  borderRadius: 3,
                  borderColor: "#7CB9E8",
                  color: "#7CB9E8",
                  "&:hover": { background: "rgba(124, 185, 232, 0.1)" }
                }}
              >
                Clear Filters
              </Button>
            )}
          </Box>
        </Paper>

        {/* QUICK CATEGORY CHIPS */}
        <Box sx={{ mb: 3, display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip
            label="All"
            onClick={() => setSelectedCategory("All")}
            sx={{
              borderRadius: 6,
              fontWeight: 600,
              fontSize: "0.85rem",
              background: selectedCategory === "All" ? "linear-gradient(135deg, #7CB9E8 0%, #A8D8EA 100%)" : "#fff",
              color: selectedCategory === "All" ? "#fff" : "#2D3748",
              border: selectedCategory === "All" ? "none" : "2px solid rgba(124, 185, 232, 0.3)",
              transition: "all 0.2s ease",
              cursor: "pointer",
              "&:hover": {
                background: selectedCategory === "All" ? "linear-gradient(135deg, #5aa3db 0%, #8bcbe3 100%)" : "rgba(124, 185, 232, 0.1)",
              }
            }}
          />
          {categories.map((cat) => (
            <Chip
              key={cat._id}
              label={cat.category}
              onClick={() => setSelectedCategory(cat._id)}
              sx={{
                borderRadius: 6,
                fontWeight: 600,
                fontSize: "0.85rem",
                background: selectedCategory === cat._id ? "linear-gradient(135deg, #7CB9E8 0%, #A8D8EA 100%)" : "#fff",
                color: selectedCategory === cat._id ? "#fff" : "#2D3748",
                border: selectedCategory === cat._id ? "none" : "2px solid rgba(124, 185, 232, 0.3)",
                transition: "all 0.2s ease",
                cursor: "pointer",
                "&:hover": {
                  background: selectedCategory === cat._id ? "linear-gradient(135deg, #5aa3db 0%, #8bcbe3 100%)" : "rgba(124, 185, 232, 0.1)",
                }
              }}
            />
          ))}
        </Box>

        {/* PRODUCT GRID - Vibrant Cards */}
        <Grid container spacing={3}>
          {sortedProducts.length > 0 ? (
            sortedProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <Card
                  sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    background: "#fff",
                    border: "1px solid rgba(124, 185, 232, 0.15)",
                    position: "relative",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 20px 40px rgba(124, 185, 232, 0.3)",
                      borderColor: "#7CB9E8",
                      "& .card-actions": {
                        opacity: 1,
                        transform: "translateY(0)",
                      },
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
                          : defaultImage
                      }
                      alt={product.name}
                      onClick={() => navigate(`/viewsingleproduct/${product._id}`)}
                      sx={{
                        objectFit: "cover",
                        cursor: "pointer",
                        transition: "transform 0.4s ease",
                        "&:hover": { transform: "scale(1.05)" }
                      }}
                    />

                    {/* Action Buttons */}
                    <Box
                      className="card-actions"
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        opacity: 0,
                        transform: "translateY(-10px)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product._id);
                        }}
                        sx={{ 
                          background: "#fff",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                          color: favorites.includes(product._id) ? "#ff6b6b" : "#7CB9E8",
                          "&:hover": { background: "#fff" }
                        }}
                      >
                        {favorites.includes(product._id) ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/viewsingleproduct/${product._id}`);
                        }}
                        sx={{ 
                          background: "#fff",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                          color: "#7CB9E8",
                          "&:hover": { background: "#fff" }
                        }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    {/* Category Badge */}
                    {product.category?.category && (
                      <Chip
                        label={product.category.category}
                        size="small"
                        sx={{
                          position: "absolute",
                          bottom: 10,
                          left: 10,
                          fontWeight: 600,
                          fontSize: "0.7rem",
                          background: "linear-gradient(135deg, #7CB9E8 0%, #A8D8EA 100%)",
                          color: "#fff",
                        }}
                      />
                    )}

                    {/* Stock Badge */}
                    <Chip
                      label={product.quantity > 0 ? "In Stock" : "Out of Stock"}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        fontWeight: 600,
                        fontSize: "0.65rem",
                        background: product.quantity > 0 ? "linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)" : "linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)",
                        color: "#fff",
                      }}
                    />
                  </Box>

                  <CardContent sx={{ p: 2 }}>
                    <Typography 
                      fontWeight={600} 
                      noWrap
                      onClick={() => navigate(`/viewsingleproduct/${product._id}`)}
                      sx={{ 
                        color: "#2D3748",
                        fontSize: "1rem",
                        cursor: "pointer",
                        "&:hover": { color: "#7CB9E8" },
                      }}
                    >
                      {product.name}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1.5 }}>
                      <Typography 
                        variant="h6" 
                        fontWeight={700}
                        sx={{ color: "#7CB9E8" }}
                      >
                        ₹{product.price}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#718096" }}>
                        {product.quantity > 0 ? `${product.quantity} available` : ''}
                      </Typography>
                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<ShoppingCartIcon />}
                      onClick={() => navigate(`/viewsingleproduct/${product._id}`)}
                      sx={{
                        mt: 2,
                        borderRadius: 3,
                        textTransform: "none",
                        fontWeight: 600,
                        background: "linear-gradient(135deg, #7CB9E8 0%, #A8D8EA 100%)",
                        boxShadow: "0 4px 12px rgba(124, 185, 232, 0.4)",
                        "&:hover": {
                          background: "linear-gradient(135deg, #5aa3db 0%, #8bcbe3 100%)",
                          boxShadow: "0 6px 16px rgba(124, 185, 232, 0.5)",
                        }
                      }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper 
                sx={{ 
                  textAlign: "center", 
                  py: 8,
                  borderRadius: 4,
                  background: "#fff",
                  border: "1px solid rgba(124, 185, 232, 0.2)",
                }}
              >
                <Inventory2Outlined sx={{ fontSize: 80, color: "#A8D8EA" }} />
                <Typography variant="h5" sx={{ color: "#2D3748", mt: 2, fontWeight: 700 }}>
                  No Products Found
                </Typography>
                <Typography variant="body2" sx={{ color: "#718096", mt: 1, mb: 3 }}>
                  Try adjusting your search or filters
                </Typography>
                <Button
                  variant="contained"
                  sx={{ 
                    borderRadius: 4,
                    background: "linear-gradient(135deg, #7CB9E8 0%, #A8D8EA 100%)",
                  }}
                  onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
                >
                  Clear All Filters
                </Button>
              </Paper>
            </Grid>
          )}
        </Grid>

      </Container>

      {/* FOOTER */}
      <Box sx={{ background: "linear-gradient(135deg, #7CB9E8 0%, #A8D8EA 100%)", py: 4, mt: 4, textAlign: "center" }}>
        <Typography sx={{ color: "#fff", fontWeight: 600 }}>
          © 2024 Shop Name. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}