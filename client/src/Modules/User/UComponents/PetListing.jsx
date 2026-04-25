import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, Container, Grid, Card, CardContent, CardMedia,
  Button, Chip, Skeleton, Alert, FormControl, InputLabel, Select,
  MenuItem, TextField, InputAdornment, Paper
} from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import axios from "axios";

const DEFAULT_PET_IMAGE = "https://placehold.co/400x400/F1F5FC/7CB9E8?text=No+Image";
const SERVER_URL = "http://localhost:7000";

const PetListing = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [typeFilter, setTypeFilter] = useState("");
  const [ageFilter, setAgeFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const petTypes = ["Dog", "Cat", "Bird", "Rabbit", "Hamster", "Guinea Pig", "Fish", "Other"];

  const getImageUrl = (imagePath) => {
    if (!imagePath) return DEFAULT_PET_IMAGE;
    if (imagePath.startsWith('http')) return imagePath;
    return `${SERVER_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
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
      const res = await axios.get("http://localhost:7000/pet/getall");
      if (res.data.success) {
        setPets(res.data.pets);
      }
    } catch (err) {
      setError("Failed to fetch pets. Please try again later.");
      console.error("Error fetching pets:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterPets = () => {
    let filtered = [...pets];

    if (typeFilter) {
      filtered = filtered.filter(pet => pet.type === typeFilter);
    }

    if (ageFilter) {
      filtered = filtered.filter(pet => {
        if (ageFilter === "0-1") return pet.age <= 1;
        if (ageFilter === "1-3") return pet.age > 1 && pet.age <= 3;
        if (ageFilter === "3-5") return pet.age > 3 && pet.age <= 5;
        if (ageFilter === "5+") return pet.age > 5;
        return true;
      });
    }

    if (searchTerm) {
      filtered = filtered.filter(pet =>
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pet.breed && pet.breed.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredPets(filtered);
  };

  const handleViewPet = (petId) => {
    navigate(`/adopt/pet/${petId}`);
  };

  if (loading) {
    return (
      <Box sx={{ py: 4, background: "#F8FAFC", minHeight: "100vh" }}>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item}>
                <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 3 }} />
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
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} color="#1E293B" mb={1}>
            Find Your New Best Friend
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Browse pets available for adoption. Give them a loving home!
          </Typography>
        </Box>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search by name or breed..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#7CB9E8" }} />
                    </InputAdornment>
                  ),
                }}
                size="small"
                sx={{ bgcolor: "#F8FAFC", borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Pet Type</InputLabel>
                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  label="Pet Type"
                >
                  <MenuItem value="">All Types</MenuItem>
                  {petTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Age Range</InputLabel>
                <Select
                  value={ageFilter}
                  onChange={(e) => setAgeFilter(e.target.value)}
                  label="Age Range"
                >
                  <MenuItem value="">All Ages</MenuItem>
                  <MenuItem value="0-1">0-1 years (Puppy/Kitten)</MenuItem>
                  <MenuItem value="1-3">1-3 years (Young)</MenuItem>
                  <MenuItem value="3-5">3-5 years (Adult)</MenuItem>
                  <MenuItem value="5+">5+ years (Senior)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
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
                sx={{ 
                  borderColor: "#7CB9E8", 
                  color: "#7CB9E8",
                  "&:hover": { borderColor: "#5BA8D8", bgcolor: "rgba(124,185,232,0.08)" }
                }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* Pet Grid */}
        {filteredPets.length > 0 ? (
          <Grid container spacing={3}>
            {filteredPets.map((pet) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={pet._id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 30px rgba(124,185,232,0.2)",
                    },
                    cursor: "pointer",
                    overflow: "hidden",
                  }}
                  onClick={() => handleViewPet(pet._id)}
                >
                  <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="220"
                    image={getImageUrl(pet.image)}
                    alt={pet.name}
                    sx={{ objectFit: "cover" }}
                    onError={(e) => {
                      e.target.src = DEFAULT_PET_IMAGE;
                    }}
                  />
                    <Chip
                      label={pet.type}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        bgcolor: "#7CB9E8",
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <CardContent sx={{ p: 2.5 }}>
                    <Typography variant="h6" fontWeight={700} color="#1E293B" gutterBottom>
                      {pet.name}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}>
                      <Chip label={pet.breed || "Unknown breed"} size="small" variant="outlined" />
                      <Chip label={`${pet.age} yrs`} size="small" variant="outlined" />
                      <Chip label={pet.gender} size="small" variant="outlined" />
                    </Box>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<PetsIcon />}
                      sx={{
                        mt: 1,
                        borderRadius: 2,
                        background: "linear-gradient(135deg, #7CB9E8 0%, #A8D8EA 100%)",
                        fontWeight: 600,
                        "&:hover": {
                          background: "linear-gradient(135deg, #5BA8D8 0%, #98C8D0 100%)",
                        },
                      }}
                    >
                      View & Adopt
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 3,
              background: "#fff",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <PetsIcon sx={{ fontSize: 80, color: "#CBD5E1", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No pets found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your filters or check back later for new arrivals!
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default PetListing;
