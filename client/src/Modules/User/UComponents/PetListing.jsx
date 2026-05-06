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
  Paper,
  IconButton,
  Grow,
  Snackbar,
  Alert,
  TextField,
  InputAdornment,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Fade,
  Divider,
  Drawer,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PetsIcon from "@mui/icons-material/Pets";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import axiosInstance from "../../../utils/axiosConfig";

const DEFAULT_PET_IMAGE =
  "https://placehold.co/400x400/F1F5FC/7CB9E8?text=No+Image";
const SERVER_URL = "http://localhost:7000";

const PRIMARY_COLOR = "#2563EB";
const ACCENT_COLOR = "#F59E0B";

const PetListing = () => {
  const navigate = useNavigate();

  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedGender, setSelectedGender] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");
  const [selectedVaccination, setSelectedVaccination] = useState("All");
  const [selectedNeutered, setSelectedNeutered] = useState("All");
  const [ageRange, setAgeRange] = useState([0, 20]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  const petTypes = ["All", "Dog", "Cat", "Bird", "Rabbit", "Hamster", "Guinea Pig", "Fish", "Other"];
  const petGenders = ["All", "Male", "Female", "Other"];
  const petSizes = ["All", "Small", "Medium", "Large", "Extra Large"];
  const vaccinationStatuses = ["All", "Vaccinated", "Not Vaccinated"];
  const neuteredStatuses = ["All", "Neutered/Spayed", "Intact"];

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "name", label: "Name (A-Z)" },
    { value: "age-low", label: "Age: Young to Old" },
    { value: "age-high", label: "Age: Old to Young" },
  ];

  const highlights = [
    {
      icon: <VerifiedIcon />,
      title: "Verified Pets",
      desc: "All pets health checked",
    },
    {
      icon: <LocalOfferIcon />,
      title: "No Fees",
      desc: "Adoption is free",
    },
    {
      icon: <TrendingUpIcon />,
      title: "Popular Breeds",
      desc: "Trending pets this week",
    },
    {
      icon: <PetsIcon />,
      title: "Happy Homes",
      desc: "500+ adoptions monthly",
    },
  ];

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedType !== "All") count++;
    if (selectedGender !== "All") count++;
    if (selectedSize !== "All") count++;
    if (selectedVaccination !== "All") count++;
    if (selectedNeutered !== "All") count++;
    if (ageRange[0] > 0 || ageRange[1] < 20) count++;
    if (searchTerm) count++;
    return count;
  };

  useEffect(() => {
    fetchPets();
    fetchWishlist();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/pet/getall");
      if (res.data.success) {
        setPets(res.data.pets || []);
      }
    } catch (err) {
      console.error("Failed to fetch pets:", err);
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
      console.log("Wishlist fetch error (using empty state):", err.message);
      setFavorites([]);
    }
  };

  const toggleFavorite = (petId) => {
    setTimeout(async () => {
      const token = localStorage.getItem("Token");
      if (!token) {
        setSnackbar({ open: true, message: "Please login to add to wishlist", severity: "info" });
        return;
      }

      let isFav;
      // Optimistic update using functional state to get latest state
      setFavorites((prev) => {
        isFav = prev.includes(petId);
        return isFav ? prev.filter((id) => id !== petId) : [...prev, petId];
      });

      try {
        if (isFav) {
          await axiosInstance.delete("/wishlist/remove", {
            data: { itemId: petId, type: "pet" },
          });
        } else {
          await axiosInstance.post("/wishlist/pet", { petId });
        }
        setSnackbar({
          open: true,
          message: isFav ? "Removed from wishlist" : "Added to wishlist",
          severity: "success",
        });
      } catch (err) {
        console.error("Error updating wishlist:", err);
        // Revert using functional update
        setFavorites((prev) => (isFav ? [...prev, petId] : prev.filter((id) => id !== petId)));
        setSnackbar({
          open: true,
          message: isFav ? "Failed to remove from wishlist" : "Failed to add to wishlist",
          severity: "error",
        });
      }
    }, 0);
  };

  const handleViewPet = (id) => {
    navigate(`/adopt/pet/${id}`);
  };

  const filteredPets = pets.filter((pet) => {
    const name = pet.name?.toLowerCase() || "";
    const breed = pet.breed?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      name.includes(search) || breed.includes(search);

    const matchesType =
      selectedType === "All" || pet.type === selectedType;

    const matchesGender =
      selectedGender === "All" || pet.gender === selectedGender;

    const matchesSize =
      selectedSize === "All" || pet.size === selectedSize;

    const matchesVaccination =
      selectedVaccination === "All" ||
      (selectedVaccination === "Vaccinated" && pet.isVaccinated) ||
      (selectedVaccination === "Not Vaccinated" && !pet.isVaccinated);

    const matchesNeutered =
      selectedNeutered === "All" ||
      (selectedNeutered === "Neutered/Spayed" && pet.isNeutered) ||
      (selectedNeutered === "Intact" && !pet.isNeutered);

    const petAge = pet.age || 0;
    const matchesAge = petAge >= ageRange[0] && petAge <= ageRange[1];

    return (
      matchesSearch &&
      matchesType &&
      matchesGender &&
      matchesSize &&
      matchesVaccination &&
      matchesNeutered &&
      matchesAge
    );
  });

  const sortedPets = [...filteredPets].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case "oldest":
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      case "name":
        return (a.name || "").localeCompare(b.name || "");
      case "age-low":
        return (a.age || 0) - (b.age || 0);
      case "age-high":
        return (b.age || 0) - (a.age || 0);
      default:
        return 0;
    }
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("All");
    setSelectedGender("All");
    setSelectedSize("All");
    setSelectedVaccination("All");
    setSelectedNeutered("All");
    setAgeRange([0, 20]);
    setSortBy("newest");
  };

  const hasActiveFilters =
    searchTerm ||
    selectedType !== "All" ||
    selectedGender !== "All" ||
    selectedSize !== "All" ||
    selectedVaccination !== "All" ||
    selectedNeutered !== "All" ||
    ageRange[0] > 0 ||
    ageRange[1] < 20;

  const getImageUrl = (imagePath) => {
    if (!imagePath) return DEFAULT_PET_IMAGE;
    if (imagePath.startsWith("http")) return imagePath;
    return `${SERVER_URL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
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
                    Find Your New
                    <br />
                    <Box component="span" sx={{ color: ACCENT_COLOR }}>
                      Best Friend
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
                    Give a loving home to a pet in need. Browse adorable pets waiting for their forever families.
                  </Typography>
                   <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                     <Button
                       variant="contained"
                       size="large"
                       startIcon={<PetsIcon />}
                       onClick={() =>
                         document.getElementById("pets")?.scrollIntoView()
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
                       Adopt Now
                     </Button>
                     <Button
                       variant="outlined"
                       size="large"
                       onClick={() => navigate("/adopt/about")}
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
                     <Button
                       variant="outlined"
                       size="large"
                       onClick={() => navigate("/adopt/submit-pet")}
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
                       Add Your Pet
                     </Button>
                     <Button
                       variant="outlined"
                       size="large"
                       onClick={() => navigate("/adopt/my-pets")}
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
                       My Pet Status
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
                <PetsIcon sx={{ fontSize: 200, color: "rgba(255,255,255,0.15)" }} />
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

      {/* PETS SECTION */}
      <Box id="pets" sx={{ py: 4, background: "#F1F5F9" }}>
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

                {/* Type Filter */}
                <Box sx={{ mb: 4 }}>
                  <Typography fontWeight={600} sx={{ color: "#475569", mb: 2 }}>
                    Pet Type
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {petTypes.map((type) => (
                      <Chip
                        key={type}
                        label={type}
                        onClick={() => setSelectedType(type)}
                        sx={{
                          borderRadius: 2,
                          fontWeight: 600,
                          background:
                            selectedType === type
                              ? PRIMARY_COLOR
                              : "transparent",
                          color: selectedType === type ? "#fff" : "#475569",
                          border:
                            selectedType === type
                              ? "none"
                              : "1px solid #E2E8F0",
                          cursor: "pointer",
                          "&:hover": {
                            background:
                              selectedType === type
                                ? PRIMARY_COLOR
                                : "#F1F5F9",
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Gender Filter */}
                <Box sx={{ mb: 4 }}>
                  <Typography fontWeight={600} sx={{ color: "#475569", mb: 2 }}>
                    Gender
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {petGenders.map((gender) => (
                      <Chip
                        key={gender}
                        label={gender}
                        onClick={() => setSelectedGender(gender)}
                        sx={{
                          borderRadius: 2,
                          fontWeight: 600,
                          background:
                            selectedGender === gender
                              ? PRIMARY_COLOR
                              : "transparent",
                          color: selectedGender === gender ? "#fff" : "#475569",
                          border:
                            selectedGender === gender
                              ? "none"
                              : "1px solid #E2E8F0",
                          cursor: "pointer",
                          "&:hover": {
                            background:
                              selectedGender === gender
                                ? PRIMARY_COLOR
                                : "#F1F5F9",
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Size Filter */}
                <Box sx={{ mb: 4 }}>
                  <Typography fontWeight={600} sx={{ color: "#475569", mb: 2 }}>
                    Size
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {petSizes.map((size) => (
                      <Chip
                        key={size}
                        label={size}
                        onClick={() => setSelectedSize(size)}
                        sx={{
                          borderRadius: 2,
                          fontWeight: 600,
                          background:
                            selectedSize === size
                              ? PRIMARY_COLOR
                              : "transparent",
                          color: selectedSize === size ? "#fff" : "#475569",
                          border:
                            selectedSize === size
                              ? "none"
                              : "1px solid #E2E8F0",
                          cursor: "pointer",
                          "&:hover": {
                            background:
                              selectedSize === size ? PRIMARY_COLOR : "#F1F5F9",
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Vaccination Filter */}
                <Box sx={{ mb: 4 }}>
                  <Typography fontWeight={600} sx={{ color: "#475569", mb: 2 }}>
                    Vaccination
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {vaccinationStatuses.map((status) => (
                      <Chip
                        key={status}
                        label={status}
                        onClick={() => setSelectedVaccination(status)}
                        sx={{
                          borderRadius: 2,
                          fontWeight: 600,
                          background:
                            selectedVaccination === status
                              ? PRIMARY_COLOR
                              : "transparent",
                          color: selectedVaccination === status ? "#fff" : "#475569",
                          border:
                            selectedVaccination === status
                              ? "none"
                              : "1px solid #E2E8F0",
                          cursor: "pointer",
                          "&:hover": {
                            background:
                              selectedVaccination === status
                                ? PRIMARY_COLOR
                                : "#F1F5F9",
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Neutered/Spayed Filter */}
                <Box sx={{ mb: 4 }}>
                  <Typography fontWeight={600} sx={{ color: "#475569", mb: 2 }}>
                    Spayed/Neutered
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {neuteredStatuses.map((status) => (
                      <Chip
                        key={status}
                        label={status}
                        onClick={() => setSelectedNeutered(status)}
                        sx={{
                          borderRadius: 2,
                          fontWeight: 600,
                          background:
                            selectedNeutered === status
                              ? PRIMARY_COLOR
                              : "transparent",
                          color: selectedNeutered === status ? "#fff" : "#475569",
                          border:
                            selectedNeutered === status
                              ? "none"
                              : "1px solid #E2E8F0",
                          cursor: "pointer",
                          "&:hover": {
                            background:
                              selectedNeutered === status
                                ? PRIMARY_COLOR
                                : "#F1F5F9",
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Age Range */}
                <Box sx={{ mb: 4 }}>
                  <Typography fontWeight={600} sx={{ color: "#475569", mb: 2 }}>
                    Age (years)
                  </Typography>
                  <Box sx={{ px: 1 }}>
                    <Slider
                      value={ageRange}
                      onChange={(e, newValue) => setAgeRange(newValue)}
                      valueLabelDisplay="auto"
                      min={0}
                      max={20}
                      sx={{
                        color: PRIMARY_COLOR,
                        "& .MuiSlider-thumb": {
                          "&:hover, &.Mui-focusVisible": {
                            boxShadow: `0 0 0 8px ${PRIMARY_COLOR}20`,
                          },
                        },
                      }}
                    />
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="caption" sx={{ color: "#64748B" }}>
                        {ageRange[0]} yrs
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#64748B" }}>
                        {ageRange[1]} yrs
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* PET GRID */}
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
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                      <Chip
                        label={getActiveFilterCount()}
                        size="small"
                        sx={{ ml: 1, bgcolor: "rgba(255,255,255,0.3)", color: "#fff", height: 20, minWidth: 20 }}
                      />
                    )}
                  </Button>
                  <Typography fontWeight={600} sx={{ color: "#475569" }}>
                    {sortedPets.length} Pets
                  </Typography>
                </Box>

                 <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                  {/* Search */}
                  <TextField
                    size="small"
                    placeholder="Search pets..."
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
                      {sortOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {/* Add Pet Button */}
                  <Button
                    variant="contained"
                    startIcon={<PetsIcon />}
                    onClick={() => navigate("/adopt/submit-pet")}
                    sx={{
                      borderRadius: 3,
                      textTransform: "none",
                      fontWeight: 600,
                      background: `linear-gradient(135deg, ${PRIMARY_COLOR} 0%, #3B82F6 100%)`,
                      boxShadow: `0 4px 14px ${PRIMARY_COLOR}40`,
                      "&:hover": {
                        background: `linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%)`,
                        boxShadow: `0 6px 20px ${PRIMARY_COLOR}40`,
                      },
                    }}
                  >
                    Add Pet
                  </Button>
                  {/* My Pets Status Button */}
                  <Button
                    variant="outlined"
                    startIcon={<VisibilityIcon />}
                    onClick={() => navigate("/adopt/my-pets")}
                    sx={{
                      borderRadius: 3,
                      textTransform: "none",
                      fontWeight: 600,
                      borderColor: PRIMARY_COLOR,
                      color: PRIMARY_COLOR,
                      "&:hover": {
                        borderColor: "#1D4ED8",
                        background: "rgba(37, 99, 235, 0.05)",
                      },
                    }}
                  >
                    My Status
                  </Button>
                </Box>
              </Paper>

              {/* PET CARDS */}
              {loading ? (
                <Grid container spacing={3}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <Grid item xs={12} sm={6} lg={3} key={i}>
                      <SkeletonCard />
                    </Grid>
                  ))}
                </Grid>
              ) : sortedPets.length > 0 ? (
                <Grid container spacing={3}>
                  {sortedPets.map((pet) => (
                    <Grid item xs={12} sm={6} lg={3} key={pet._id}>
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
                              "& .pet-image": {
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
                              alt={pet.name}
                              className="pet-image"
                              onClick={() => handleViewPet(pet._id)}
                              sx={{
                                objectFit: "cover",
                                cursor: "pointer",
                                transition: "transform 0.4s ease",
                              }}
                              onError={(e) => (e.target.src = DEFAULT_PET_IMAGE)}
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
                                  toggleFavorite(pet._id);
                                }}
                                sx={{
                                  background: "#fff",
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                  color: favorites.includes(pet._id)
                                    ? "#EF4444"
                                    : PRIMARY_COLOR,
                                  "&:hover": { background: "#fff" },
                                }}
                              >
                                {favorites.includes(pet._id) ? (
                                  <FavoriteIcon fontSize="small" />
                                ) : (
                                  <FavoriteBorderIcon fontSize="small" />
                                )}
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewPet(pet._id);
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

                            {/* Type Badge */}
                            {pet.type && (
                              <Chip
                                label={pet.type}
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

                            {/* Status Badge */}
                            <Chip
                              label={pet.status === "Available" ? "Available" : pet.status || "Available"}
                              size="small"
                              sx={{
                                position: "absolute",
                                top: 10,
                                left: 10,
                                fontWeight: 600,
                                fontSize: "0.65rem",
                                background: pet.status === "Adopted" ? "#EF4444" : "#10B981",
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
                              sx={{ mb: 0.5 }}
                            >
                              {pet.breed || "Unknown breed"}
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              noWrap
                            >
                              {pet.age || 0} years • {pet.gender || "Unknown"}
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
                <Paper
                  sx={{
                    textAlign: "center",
                    py: 8,
                    borderRadius: 3,
                    background: "#fff",
                  }}
                >
                  <PetsIcon sx={{ fontSize: 80, color: "#CBD5E1" }} />
                  <Typography
                    variant="h5"
                    sx={{ color: "#1E293B", mt: 2, fontWeight: 700 }}
                  >
                    No Pets Found
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
            Stay Updated
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
            Get notified when new pets become available for adoption.
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
              startIcon={<EmailIcon />}
              sx={{
                background: ACCENT_COLOR,
                color: "#fff",
                px: 4,
                borderRadius: 3,
                fontWeight: 600,
                "&:hover": { background: "#D97706" },
              }}
            >
              Notify Me
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
                  <PetsIcon sx={{ color: "#fff" }} />
                </Avatar>
                <Typography variant="h5" fontWeight={700}>
                  FurLink
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.7)", mb: 3 }}
              >
                Your trusted partner in finding loving homes for pets in need.
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
              {["Home", "Adopt", "About", "Contact"].map((link) => (
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

            <Grid item xs={6} md={3}>
              <Typography fontWeight={700} sx={{ mb: 2 }}>
                Adoption
              </Typography>
              <Box
                sx={{
                  py: 0.5,
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.7)",
                  "&:hover": { color: "#fff" },
                }}
              >
                How It Works
              </Box>
              <Box
                sx={{
                  py: 0.5,
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.7)",
                  "&:hover": { color: "#fff" },
                }}
              >
                Requirements
              </Box>
              <Box
                sx={{
                  py: 0.5,
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.7)",
                  "&:hover": { color: "#fff" },
                }}
              >
                Success Stories
              </Box>
              <Box
                sx={{
                  py: 0.5,
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.7)",
                  "&:hover": { color: "#fff" },
                }}
              >
                Volunteer
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography fontWeight={700} sx={{ mb: 2 }}>
                Contact Us
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <LocationOnIcon sx={{ mr: 1, color: "rgba(255,255,255,0.7)" }} />
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                  123 Pet Avenue, City
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <PhoneIcon sx={{ mr: 1, color: "rgba(255,255,255,0.7)" }} />
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                  +1 234 567 8900
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <EmailIcon sx={{ mr: 1, color: "rgba(255,255,255,0.7)" }} />
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                  adopt@furlink.com
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
        </Snackbar>
      </Box>
    );
  }

  export default PetListing;