import React, { useState, useEffect } from "react";
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
  Chip,
  Skeleton,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Paper,
  IconButton,
  Grow,
  Snackbar,
  Alert as MuiAlert,
} from "@mui/material";

import PetsIcon from "@mui/icons-material/Pets";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from "@mui/icons-material/Visibility";

import axiosInstance from "../../../utils/axiosConfig";

const DEFAULT_PET_IMAGE =
  "https://placehold.co/400x400/F1F5FC/7CB9E8?text=No+Image";
const SERVER_URL = "http://localhost:7000";

const PRIMARY_COLOR = "#2563EB";

const PetListing = () => {
  const navigate = useNavigate();

  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [typeFilter, setTypeFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const petTypes = [
    "Dog",
    "Cat",
    "Bird",
    "Rabbit",
    "Hamster",
    "Guinea Pig",
    "Fish",
    "Other",
  ];

  const getImageUrl = (imagePath) => {
    if (!imagePath) return DEFAULT_PET_IMAGE;
    if (imagePath.startsWith("http")) return imagePath;
    return `${SERVER_URL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  };

  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    filterPets();
  }, [pets, typeFilter, ageFilter, searchTerm]);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/pet/getall");
      if (res.data.success) {
        setPets(res.data.pets);
      }
    } catch (err) {
      setError("Failed to fetch pets. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const res = await axiosInstance.get("/wishlist/");
      const wishlistPets = res.data.wishlist?.pets?.map(p => p._id) || [];
      setFavorites(wishlistPets);
    } catch (err) {
      console.log("No wishlist found:", err.message);
    }
  };

  useEffect(() => {
    fetchPets();
    fetchWishlist();
  }, []);

  const filterPets = () => {
    let filtered = [...pets];

    if (typeFilter) {
      filtered = filtered.filter((pet) => pet.type === typeFilter);
    }

    if (ageFilter) {
      filtered = filtered.filter((pet) => {
        if (ageFilter === "0-1") return pet.age <= 1;
        if (ageFilter === "1-3") return pet.age > 1 && pet.age <= 3;
        if (ageFilter === "3-5") return pet.age > 3 && pet.age <= 5;
        if (ageFilter === "5+") return pet.age > 5;
        return true;
      });
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (pet) =>
          pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (pet.breed &&
            pet.breed.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredPets(filtered);
  };

  const handleViewPet = (id) => {
    navigate(`/adopt/pet/${id}`);
  };

  const toggleFavorite = async (petId) => {
    const token = localStorage.getItem("Token");
    if (!token) {
      setSnackbar({ open: true, message: "Please login to add to wishlist", severity: "info" });
      return;
    }

    const isFav = favorites.includes(petId);
    setSnackbar({ open: true, message: isFav ? "Removed from wishlist" : "Added to wishlist", severity: "success" });

    if (isFav) {
      setFavorites(favorites.filter(id => id !== petId));
      try {
        await axiosInstance.delete("/wishlist/remove", {
          data: { itemId: petId, type: "pet" },
        });
      } catch (err) {
        console.error("Error removing from wishlist:", err);
      }
    } else {
      setFavorites([...favorites, petId]);
      try {
        await axiosInstance.post("/wishlist/pet", { petId });
      } catch (err) {
        console.error("Error adding to wishlist:", err);
        setFavorites(favorites.filter(id => id !== petId));
      }
    }
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
            height: 220,
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

   /* ---------------- LOADING ---------------- */
   if (loading) {
     return (
       <Box sx={{ py: 4, background: "#F8FAFC", minHeight: "100vh" }}>
         <Container maxWidth="xl">
           <Grid container spacing={3}>
             {[...Array(8)].map((_, i) => (
               <Grid item xs={12} sm={6} lg={3} key={i}>
                 <SkeletonCard />
               </Grid>
             ))}
           </Grid>
         </Container>
       </Box>
     );
   }

  return (
    <Box sx={{ py: 4, background: "#F8FAFC", minHeight: "100vh" }}>
      <Container maxWidth="xl">
        {/* HEADER */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700}>
            Find Your New Best Friend 🐾
          </Typography>
          <Typography color="text.secondary">
            Browse pets available for adoption
          </Typography>
        </Box>

        {/* FILTERS */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
          <Grid container spacing={2}>
            {/* Search */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search pets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Type */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Pet Type</InputLabel>
                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  label="Pet Type"
                >
                  <MenuItem value="">All</MenuItem>
                  {petTypes.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Age */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Age</InputLabel>
                <Select
                  value={ageFilter}
                  onChange={(e) => setAgeFilter(e.target.value)}
                  label="Age"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="0-1">0-1</MenuItem>
                  <MenuItem value="1-3">1-3</MenuItem>
                  <MenuItem value="3-5">3-5</MenuItem>
                  <MenuItem value="5+">5+</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Clear */}
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={() => {
                  setTypeFilter("");
                  setAgeFilter("");
                  setSearchTerm("");
                }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {error && <Alert severity="error">{error}</Alert>}

         {/* PET CARDS */}
         {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Grid item xs={12} sm={6} lg={3} key={i}>
                 <SkeletonCard />
               </Grid>
             ))}
          </Grid>
          ) : filteredPets.length > 0 ? (
           <Grid container spacing={3}>
             {filteredPets.map((pet) => (
               <Grid item xs={12} sm={6} lg={3} key={pet._id}>
                 <Grow in timeout={400}>
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
                        image={getImageUrl(pet.image)}
                        onClick={() => handleViewPet(pet._id)}
                        sx={{
                          objectFit: "cover",
                          cursor: "pointer",
                          transition: "transform 0.4s ease",
                        }}
                        onError={(e) =>
                          (e.target.src = DEFAULT_PET_IMAGE)
                        }
                      />

                       {/* Buttons */}
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
                           sx={{
                             bgcolor: "#fff",
                             color: favorites.includes(pet._id) ? "#EF4444" : PRIMARY_COLOR,
                           }}
                           onClick={(e) => {
                             e.stopPropagation();
                             toggleFavorite(pet._id);
                           }}
                         >
                           {favorites.includes(pet._id) ? (
                             <FavoriteIcon fontSize="small" />
                           ) : (
                             <FavoriteBorderIcon fontSize="small" />
                           )}
                         </IconButton>
                         <IconButton
                           sx={{ bgcolor: "#fff" }}
                           onClick={(e) => {
                             e.stopPropagation();
                             handleViewPet(pet._id);
                           }}
                         >
                           <VisibilityIcon />
                         </IconButton>
                       </Box>

                      {/* Chips */}
                      <Chip
                        label={pet.type}
                        size="small"
                        sx={{
                          position: "absolute",
                          bottom: 10,
                          left: 10,
                          bgcolor: PRIMARY_COLOR,
                          color: "#fff",
                        }}
                      />

                      <Chip
                        label="Available"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 10,
                          left: 10,
                          bgcolor: "#10B981",
                          color: "#fff",
                        }}
                      />
                    </Box>

                    <CardContent sx={{ p: 2 }}>
                      <Typography
                        fontWeight={600}
                        noWrap
                        onClick={() => handleViewPet(pet._id)}
                        sx={{
                          color: "#1E293B",
                          fontSize: "1rem",
                          cursor: "pointer",
                          "&:hover": { color: PRIMARY_COLOR },
                        }}
                      >
                        {pet.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                      >
                        {pet.breed || "Unknown"}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                      >
                        {pet.age} yrs • {pet.gender}
                      </Typography>

                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<PetsIcon />}
                        onClick={() => handleViewPet(pet._id)}
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
                        Adopt Now
                      </Button>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper sx={{ p: 5, textAlign: "center" }}>
            <Typography>No pets found 🐾</Typography>
          </Paper>
         )}
       </Container>

       {/* Notification Snackbar */}
       <Snackbar
         open={snackbar.open}
         autoHideDuration={3000}
         onClose={() => setSnackbar({ ...snackbar, open: false })}
         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
       >
         <MuiAlert
           onClose={() => setSnackbar({ ...snackbar, open: false })}
           severity={snackbar.severity}
           variant="filled"
           sx={{ width: "100%" }}
         >
           {snackbar.message}
         </MuiAlert>
       </Snackbar>
     </Box>
   );
 };

export default PetListing;