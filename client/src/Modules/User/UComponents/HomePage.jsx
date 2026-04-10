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
  Slider,
  Drawer,
  Badge,
  Fade,
  Grow,
  Avatar,
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
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import Pets from "@mui/icons-material/Pets";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import axios from "axios";

const DEFAULT_IMAGE = "https://placehold.co/400x400/F1F5F9/2563EB?text=No+Image";

const PRIMARY_COLOR = "#2563EB";
const ACCENT_COLOR = "#F59E0B";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedCategory !== "All") count++;
    if (priceRange[0] > 0 || priceRange[1] < 10000) count++;
    if (inStockOnly) count++;
    return count;
  };

  const navigate = useNavigate();
  const defaultImage = DEFAULT_IMAGE;

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:7000/product/getproducts");
      setProducts(res.data.pdata || []);
      setTimeout(() => setLoading(false), 800);
    } catch (err) {
      console.log(err);
      setLoading(false);
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

  const toggleFavorite = (productId) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const filteredProducts = products.filter((p) => {
    const name = p?.name?.toLowerCase() || "";
    const catName = p?.category?.category?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      name.includes(search) || catName.includes(search);
    const matchesCategory =
      selectedCategory === "All" || p?.category?._id === selectedCategory;
    const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    const matchesStock = inStockOnly ? p.quantity > 0 : true;

    return matchesSearch && matchesCategory && matchesPrice && matchesStock;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setPriceRange([0, 10000]);
    setInStockOnly(false);
  };

  const hasActiveFilters =
    searchTerm ||
    selectedCategory !== "All" ||
    priceRange[0] > 0 ||
    priceRange[1] < 10000 ||
    inStockOnly;

  const highlights = [
    {
      icon: <LocalShippingIcon />,
      title: "Free Shipping",
      desc: "On orders over ₹499",
    },
    {
      icon: <VerifiedIcon />,
      title: "100% Authentic",
      desc: "Verified products only",
    },
    {
      icon: <LocalOfferIcon />,
      title: "Best Deals",
      desc: "Up to 70% off daily",
    },
    {
      icon: <TrendingUpIcon />,
      title: "Trending",
      desc: "Top picks for you",
    },
  ];

  const categoryIcons = {
    Food: "🍖",
    Toys: "🎾",
    Accessories: "🎀",
    Grooming: "✂️",
    Bed: "🛏️",
    Collars: "⭕",
    default: "📦",
  };

  const SkeletonCard = () => (
    <Paper
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        background: "#fff",
      }}
    >
      <Box
        sx={{
          height: 200,
          background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
          "@keyframes shimmer": {
            "0%": { backgroundPosition: "200% 0" },
            "100%": { backgroundPosition: "-200% 0" },
          },
        }}
      />
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            height: 20,
            width: "70%",
            background: "#f0f0f0",
            borderRadius: 1,
            mb: 1,
          }}
        />
        <Box
          sx={{
            height: 16,
            width: "40%",
            background: "#f0f0f0",
            borderRadius: 1,
          }}
        />
      </Box>
    </Paper>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#F8FAFC",
        fontFamily: "'Poppins', 'Inter', sans-serif",
      }}
    >
      {/* HERO SECTION */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${PRIMARY_COLOR} 0%, #1E40AF 100%)`,
          py: { xs: 6, md: 10 },
          px: 3,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "-50%",
            right: "-10%",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "-30%",
            left: "-5%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.03)",
          }}
        />

        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Fade in timeout={800}>
                <Box>
                  <Typography
                    variant="h1"
                    fontWeight={800}
                    sx={{
                      color: "#fff",
                      fontSize: { xs: "2.5rem", md: "4rem" },
                      lineHeight: 1.2,
                      mb: 2,
                    }}
                  >
                    Discover Amazing
                    <br />
                    <Box
                      component="span"
                      sx={{ color: ACCENT_COLOR }}
                    >
                      Deals
                    </Box>
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "rgba(255,255,255,0.85)",
                      mb: 4,
                      fontSize: { xs: "1rem", md: "1.25rem" },
                      maxWidth: 500,
                    }}
                  >
                    Find everything your pet needs in one place. Quality products,
                    unbeatable prices, and fast delivery!
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<ShoppingCartIcon />}
                      onClick={() =>
                        document.getElementById("products")?.scrollIntoView()
                      }
                      sx={{
                        background: ACCENT_COLOR,
                        color: "#fff",
                        px: 4,
                        py: 1.5,
                        fontSize: "1rem",
                        fontWeight: 600,
                        borderRadius: 3,
                        textTransform: "none",
                        boxShadow: `0 8px 25px ${ACCENT_COLOR}40`,
                        "&:hover": {
                          background: "#D97706",
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Shop Now
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      sx={{
                        borderColor: "rgba(255,255,255,0.5)",
                        color: "#fff",
                        px: 4,
                        py: 1.5,
                        fontSize: "1rem",
                        fontWeight: 600,
                        borderRadius: 3,
                        textTransform: "none",
                        "&:hover": {
                          borderColor: "#fff",
                          background: "rgba(255,255,255,0.1)",
                        },
                      }}
                    >
                      Learn More
                    </Button>
                  </Box>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: { xs: "none", md: "block" } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Pets sx={{ fontSize: 200, color: "rgba(255,255,255,0.15)" }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* HIGHLIGHTS BAR */}
      <Container maxWidth="lg" sx={{ mt: -5, position: "relative", zIndex: 2 }}>
        <Grid container spacing={2}>
          {highlights.map((item, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: "#fff",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <Box
                  sx={{
                    color: PRIMARY_COLOR,
                    display: "flex",
                    justifyContent: "center",
                    mb: 1,
                  }}
                >
                  {item.icon}
                </Box>
                <Typography
                  fontWeight={700}
                  sx={{ fontSize: "0.9rem", color: "#1E293B" }}
                >
                  {item.title}
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748B" }}>
                  {item.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CATEGORIES SECTION */}
      {/* <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ color: "#1E293B", mb: 1 }}
          >
            Shop by Category
          </Typography>
          <Typography variant="body1" sx={{ color: "#64748B" }}>
            Browse our wide range of pet products
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            pb: 2,
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          <Paper
            elevation={0}
            onClick={() => setSelectedCategory("All")}
            sx={{
              minWidth: 140,
              p: 2,
              borderRadius: 3,
              background:
                selectedCategory === "All"
                  ? `linear-gradient(135deg, ${PRIMARY_COLOR} 0%, #3B82F6 100%)`
                  : "#fff",
              color: selectedCategory === "All" ? "#fff" : "#1E293B",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
              },
            }}
          >
            <Typography sx={{ fontSize: "2rem", mb: 1 }}>
              🏬
            </Typography>
            <Typography fontWeight={600}>All</Typography>
          </Paper>
          {categories.map((cat) => (
            <Paper
              key={cat._id}
              elevation={0}
              onClick={() => setSelectedCategory(cat._id)}
              sx={{
                minWidth: 140,
                p: 2,
                borderRadius: 3,
                background:
                  selectedCategory === cat._id
                    ? `linear-gradient(135deg, ${PRIMARY_COLOR} 0%, #3B82F6 100%)`
                    : "#fff",
                color: selectedCategory === cat._id ? "#fff" : "#1E293B",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
                },
              }}
            >
              <Typography sx={{ fontSize: "2rem", mb: 1 }}>
                {categoryIcons[cat.category] || categoryIcons.default}
              </Typography>
              <Typography fontWeight={600}>{cat.category}</Typography>
            </Paper>
          ))}
        </Box>
      </Container> */}

      {/* PRODUCTS SECTION */}
      <Box id="products" sx={{ py: 4, background: "#F1F5F9" }}>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            {/* FILTERS SIDEBAR - Desktop */}
            <Grid item xs={12} md={3} sx={{ display: showFilters ? "block" : "none" }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: "#fff",
                  position: "sticky",
                  top: 90,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ color: "#1E293B" }}
                  >
                    Filters
                  </Typography>
                  {hasActiveFilters && (
                    <Button
                      size="small"
                      onClick={clearFilters}
                      sx={{ color: PRIMARY_COLOR, fontSize: "0.8rem" }}
                    >
                      Clear All
                    </Button>
                  )}
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Typography
                    fontWeight={600}
                    sx={{ color: "#475569", mb: 2 }}
                  >
                    Category
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Chip
                      label="All Categories"
                      onClick={() => setSelectedCategory("All")}
                      sx={{
                        borderRadius: 2,
                        fontWeight: 600,
                        background:
                          selectedCategory === "All"
                            ? PRIMARY_COLOR
                            : "transparent",
                        color: selectedCategory === "All" ? "#fff" : "#475569",
                        border:
                          selectedCategory === "All"
                            ? "none"
                            : "1px solid #E2E8F0",
                        cursor: "pointer",
                        "&:hover": {
                          background:
                            selectedCategory === "All"
                              ? PRIMARY_COLOR
                              : "#F1F5F9",
                        },
                      }}
                    />
                    {categories.map((cat) => (
                      <Chip
                        key={cat._id}
                        label={cat.category}
                        onClick={() => setSelectedCategory(cat._id)}
                        sx={{
                          borderRadius: 2,
                          fontWeight: 600,
                          background:
                            selectedCategory === cat._id
                              ? PRIMARY_COLOR
                              : "transparent",
                          color:
                            selectedCategory === cat._id ? "#fff" : "#475569",
                          border:
                            selectedCategory === cat._id
                              ? "none"
                              : "1px solid #E2E8F0",
                          cursor: "pointer",
                          "&:hover": {
                            background:
                              selectedCategory === cat._id
                                ? PRIMARY_COLOR
                                : "#F1F5F9",
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Typography
                    fontWeight={600}
                    sx={{ color: "#475569", mb: 2 }}
                  >
                    Price Range
                  </Typography>
                  <Box sx={{ px: 1 }}>
                    <Slider
                      value={priceRange}
                      onChange={(e, newValue) => setPriceRange(newValue)}
                      valueLabelDisplay="auto"
                      min={0}
                      max={10000}
                      sx={{
                        color: PRIMARY_COLOR,
                        "& .MuiSlider-thumb": {
                          "&:hover, &.Mui-focusVisible": {
                            boxShadow: `0 0 0 8px ${PRIMARY_COLOR}20`,
                          },
                        },
                      }}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="caption" sx={{ color: "#64748B" }}>
                        ₹{priceRange[0]}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#64748B" }}>
                        ₹{priceRange[1]}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box>
                  <Typography
                    fontWeight={600}
                    sx={{ color: "#475569", mb: 2 }}
                  >
                    Availability
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      cursor: "pointer",
                    }}
                    onClick={() => setInStockOnly(!inStockOnly)}
                  >
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: 1,
                        border: "2px solid #E2E8F0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: inStockOnly ? PRIMARY_COLOR : "#fff",
                      }}
                    >
                      {inStockOnly && (
                        <CheckCircleIcon
                          sx={{ fontSize: 16, color: "#fff" }}
                        />
                      )}
                    </Box>
                    <Typography sx={{ color: "#475569", fontWeight: 500 }}>
                      In Stock Only
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* PRODUCT GRID */}
            <Grid item xs={12} md={showFilters ? 9 : 12}>
              {/* TOOLBAR */}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  mb: 3,
                  background: "#fff",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Button
                    variant={showFilters ? "contained" : "outlined"}
                    startIcon={<FilterListIcon />}
                    onClick={() => setShowFilters(!showFilters)}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      color: showFilters ? "#fff" : PRIMARY_COLOR,
                      borderColor: PRIMARY_COLOR,
                      background: showFilters ? PRIMARY_COLOR : "transparent",
                      "&:hover": {
                        background: showFilters ? "#1D4ED8" : "transparent",
                        borderColor: PRIMARY_COLOR,
                      },
                    }}
                  >
                    Filters
                    {getActiveFilterCount() > 0 && (
                      <Badge
                        badgeContent={getActiveFilterCount()}
                        color="error"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Button>
                  <Typography
                    fontWeight={600}
                    sx={{ color: "#475569" }}
                  >
                    {sortedProducts.length} Products
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  {/* Search */}
                  <TextField
                    size="small"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: "#94A3B8" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      width: { xs: "100%", sm: 200 },
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        "& fieldset": { borderColor: "#E2E8F0" },
                        "&:hover fieldset": { borderColor: PRIMARY_COLOR },
                        "&.Mui-focused fieldset": { borderColor: PRIMARY_COLOR },
                      },
                    }}
                  />

                  {/* Sort */}
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      sx={{
                        borderRadius: 3,
                        "& fieldset": { borderColor: "#E2E8F0" },
                        "&:hover fieldset": { borderColor: PRIMARY_COLOR },
                        "&.Mui-focused fieldset": { borderColor: PRIMARY_COLOR },
                      }}
                    >
                      <MenuItem value="featured">Featured</MenuItem>
                      <MenuItem value="price-low">Price: Low to High</MenuItem>
                      <MenuItem value="price-high">Price: High to Low</MenuItem>
                      <MenuItem value="name">Name</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Paper>

              {/* PRODUCT CARDS */}
              {loading ? (
                <Grid container spacing={3}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <Grid item xs={12} sm={6} lg={3} key={i}>
                      <SkeletonCard />
                    </Grid>
                  ))}
                </Grid>
              ) : sortedProducts.length > 0 ? (
                <Grid container spacing={3}>
                  {sortedProducts.map((product) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      lg={3}
                      key={product._id}
                    >
                      <Grow in timeout={500}>
                        <Card
                          sx={{
                            borderRadius: 3,
                            overflow: "hidden",
                            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                            background: "#fff",
                            position: "relative",
                            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                            "&:hover": {
                              transform: "translateY(-8px)",
                              boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                              "& .card-actions": {
                                opacity: 1,
                                transform: "translateY(0)",
                              },
                              "& .product-image": {
                                transform: "scale(1.08)",
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
                              className="product-image"
                              onClick={() =>
                                navigate(`/viewsingleproduct/${product._id}`)
                              }
                              sx={{
                                objectFit: "cover",
                                cursor: "pointer",
                                transition: "transform 0.4s ease",
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
                                  color: favorites.includes(product._id)
                                    ? "#EF4444"
                                    : PRIMARY_COLOR,
                                  "&:hover": { background: "#fff" },
                                }}
                              >
                                {favorites.includes(product._id) ? (
                                  <FavoriteIcon fontSize="small" />
                                ) : (
                                  <FavoriteBorderIcon fontSize="small" />
                                )}
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
                                  color: PRIMARY_COLOR,
                                  "&:hover": { background: "#fff" },
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
                                  background: PRIMARY_COLOR,
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
                                background:
                                  product.quantity > 0 ? "#10B981" : "#EF4444",
                                color: "#fff",
                              }}
                            />
                          </Box>

                          <CardContent sx={{ p: 2 }}>
                            <Typography
                              fontWeight={600}
                              noWrap
                              onClick={() =>
                                navigate(`/viewsingleproduct/${product._id}`)
                              }
                              sx={{
                                color: "#1E293B",
                                fontSize: "1rem",
                                cursor: "pointer",
                                "&:hover": { color: PRIMARY_COLOR },
                              }}
                            >
                              {product.name}
                            </Typography>

                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                mt: 1.5,
                              }}
                            >
                              <Typography
                                variant="h6"
                                fontWeight={700}
                                sx={{ color: PRIMARY_COLOR }}
                              >
                                ₹{product.price}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{ color: "#64748B" }}
                              >
                                {product.quantity > 0
                                  ? `${product.quantity} available`
                                  : ""}
                              </Typography>
                            </Box>

                            <Button
                              fullWidth
                              variant="contained"
                              startIcon={<ShoppingCartIcon />}
                              onClick={() =>
                                navigate(`/viewsingleproduct/${product._id}`)
                              }
                              sx={{
                                mt: 2,
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
                              Add to Cart
                            </Button>
                          </CardContent>
                        </Card>
                      </Grow>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Paper
                  sx={{
                    textAlign: "center",
                    py: 8,
                    borderRadius: 3,
                    background: "#fff",
                  }}
                >
                  <Inventory2Outlined
                    sx={{ fontSize: 80, color: "#CBD5E1" }}
                  />
                  <Typography
                    variant="h5"
                    sx={{ color: "#1E293B", mt: 2, fontWeight: 700 }}
                  >
                    No Products Found
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#64748B", mt: 1, mb: 3 }}
                  >
                    Try adjusting your search or filters
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={clearFilters}
                    sx={{
                      borderRadius: 3,
                      background: PRIMARY_COLOR,
                    }}
                  >
                    Clear All Filters
                  </Button>
                </Paper>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* MOBILE FILTER DRAWER */}
      <Drawer
        anchor="bottom"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: "80vh",
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Typography variant="h6" fontWeight={700}>
              Filters
            </Typography>
            <IconButton onClick={() => setFilterDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography fontWeight={600} sx={{ color: "#475569", mb: 2 }}>
              Category
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Chip
                label="All"
                onClick={() => {
                  setSelectedCategory("All");
                  setFilterDrawerOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  background:
                    selectedCategory === "All" ? PRIMARY_COLOR : "#F1F5F9",
                  color: selectedCategory === "All" ? "#fff" : "#475569",
                }}
              />
              {categories.map((cat) => (
                <Chip
                  key={cat._id}
                  label={cat.category}
                  onClick={() => {
                    setSelectedCategory(cat._id);
                    setFilterDrawerOpen(false);
                  }}
                  sx={{
                    borderRadius: 2,
                    background:
                      selectedCategory === cat._id ? PRIMARY_COLOR : "#F1F5F9",
                    color: selectedCategory === cat._id ? "#fff" : "#475569",
                  }}
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography fontWeight={600} sx={{ color: "#475569", mb: 2 }}>
              Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
            </Typography>
            <Slider
              value={priceRange}
              onChange={(e, newValue) => setPriceRange(newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={10000}
              sx={{ color: PRIMARY_COLOR }}
            />
          </Box>

          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
              }}
              onClick={() => setInStockOnly(!inStockOnly)}
            >
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: 1,
                  border: "2px solid #E2E8F0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: inStockOnly ? PRIMARY_COLOR : "#fff",
                }}
              >
                {inStockOnly && (
                  <CheckCircleIcon sx={{ fontSize: 16, color: "#fff" }} />
                )}
              </Box>
              <Typography>In Stock Only</Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={clearFilters}
              sx={{ borderRadius: 3 }}
            >
              Clear All
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={() => setFilterDrawerOpen(false)}
              sx={{ borderRadius: 3, background: PRIMARY_COLOR }}
            >
              Apply
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* NEWSLETTER SECTION */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${PRIMARY_COLOR} 0%, #1E40AF 100%)`,
          py: 8,
          mt: 6,
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ color: "#fff", mb: 2 }}
          >
            Subscribe to Our Newsletter
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "rgba(255,255,255,0.8)",
              mb: 4,
              maxWidth: 500,
              mx: "auto",
            }}
          >
            Get the latest updates on new products and upcoming sales directly to
            your inbox.
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              maxWidth: 500,
              mx: "auto",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <TextField
              placeholder="Enter your email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: "#94A3B8" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                flex: 1,
                minWidth: 250,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  background: "#fff",
                },
              }}
            />
            <Button
              variant="contained"
              size="large"
              sx={{
                background: ACCENT_COLOR,
                color: "#fff",
                px: 4,
                borderRadius: 3,
                fontWeight: 600,
                "&:hover": { background: "#D97706" },
              }}
            >
              Subscribe
            </Button>
          </Box>
        </Container>
      </Box>

      {/* FOOTER */}
      <Box sx={{ background: "#1E293B", py: 8, color: "#fff" }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  sx={{
                    mr: 1.5,
                    width: 40,
                    height: 40,
                    background: `linear-gradient(135deg, ${PRIMARY_COLOR} 0%, #3B82F6 100%)`,
                  }}
                >
                  <Pets sx={{ color: "#fff" }} />
                </Avatar>
                <Typography variant="h5" fontWeight={700}>
                  FurLink
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.7)", mb: 3 }}
              >
                Your one-stop shop for all pet needs. We provide quality products
                for your furry friends.
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton sx={{ color: "#fff" }}>
                  <FacebookIcon />
                </IconButton>
                <IconButton sx={{ color: "#fff" }}>
                  <InstagramIcon />
                </IconButton>
                <IconButton sx={{ color: "#fff" }}>
                  <TwitterIcon />
                </IconButton>
                <IconButton sx={{ color: "#fff" }}>
                  <LinkedInIcon />
                </IconButton>
              </Box>
            </Grid>

            <Grid item xs={6} md={2}>
              <Typography fontWeight={700} sx={{ mb: 2 }}>
                Quick Links
              </Typography>
              {["Home", "About", "Shop", "Contact"].map((link) => (
                <Box
                  key={link}
                  sx={{
                    py: 0.5,
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.7)",
                    "&:hover": { color: "#fff" },
                  }}
                >
                  {link}
                </Box>
              ))}
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography fontWeight={700} sx={{ mb: 2 }}>
                Contact Us
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <LocationOnIcon
                  sx={{ mr: 1, color: "rgba(255,255,255,0.7)" }}
                />
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                  123 Pet Store Street, City
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <PhoneIcon sx={{ mr: 1, color: "rgba(255,255,255,0.7)" }} />
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                  +91 1234567890
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <EmailIcon sx={{ mr: 1, color: "rgba(255,255,255,0.7)" }} />
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                  support@furlink.com
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box
            sx={{
              mt: 6,
              pt: 3,
              borderTop: "1px solid rgba(255,255,255,0.1)",
              textAlign: "center",
            }}
          >
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)" }}>
              © 2024 FurLink. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}