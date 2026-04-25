import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Typography, Container, Grid, Card, CardContent, CardMedia,
  Button, Chip, CircularProgress, Alert, Paper, Divider, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Snackbar
} from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import axios from "axios";

const DEFAULT_PET_IMAGE = "https://placehold.co/600x400/F1F5FC/7CB9E8?text=No+Image";
const SERVER_URL = "http://localhost:7000";

const PetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const getImageUrl = (imagePath) => {
    if (!imagePath) return DEFAULT_PET_IMAGE;
    if (imagePath.startsWith('http')) return imagePath;
    return `${SERVER_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAdoptForm, setOpenAdoptForm] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    fetchPetDetails();
  }, [id]);

  const fetchPetDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:7000/pet/single/${id}`);
      if (res.data.success) {
        setPet(res.data.pet);
      }
    } catch (err) {
      setError("Failed to fetch pet details. Please try again.");
      console.error("Error fetching pet:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAdoptSubmit = async () => {
    try {
      const token = localStorage.getItem("Token");
      if (!token) {
        setSnackbar({ open: true, message: "Please login to adopt a pet", severity: "error" });
        return;
      }

      const payload = {
        petId: pet._id,
        petName: pet.name,
        petType: pet.type,
        petBreed: pet.breed,
        petAge: pet.age,
        petGender: pet.gender,
        petImage: pet.image,
        description: pet.description,
        adopterDetails: {
          fullname: formData.fullname,
          email: formData.email,
          phone: Number(formData.phone),
          address: formData.address
        }
      };

      await axios.post("http://localhost:7000/adopt/create", payload, {
        headers: { "auth-token": token }
      });

      setSnackbar({ open: true, message: "Adoption request submitted successfully! Status: Pending", severity: "success" });
      setOpenAdoptForm(false);
      setFormData({ fullname: "", email: "", phone: "", address: "" });
      
      setTimeout(() => {
        navigate("/adopt/my-adoptions");
      }, 2000);
    } catch (err) {
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.message || "Failed to submit adoption request", 
        severity: "error" 
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress sx={{ color: "#7CB9E8" }} />
      </Box>
    );
  }

  if (error || !pet) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error || "Pet not found"}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/adopt/browse")} sx={{ mt: 2, color: "#7CB9E8" }}>
          Back to Browse
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 4, background: "#F8FAFC", minHeight: "100vh" }}>
      <Container maxWidth="lg">
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/adopt/browse")}
          sx={{ mb: 3, color: "#7CB9E8", fontWeight: 600 }}
        >
          Back to Browse
        </Button>

        <Grid container spacing={4}>
          {/* Pet Image */}
          <Grid item xs={12} md={6}>
               <Card sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                <CardMedia
                  component="img"
                  height="400"
                  image={getImageUrl(pet.image)}
                  alt={pet.name}
                  sx={{ objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = DEFAULT_PET_IMAGE;
                  }}
                />
              </Card>
          </Grid>

          {/* Pet Details */}
          <Grid item xs={12} md={6}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Typography variant="h3" fontWeight={700} color="#1E293B">
                  {pet.name}
                </Typography>
                <Chip label={pet.status} color={pet.status === "Available" ? "success" : "default"} sx={{ fontWeight: 600 }} />
              </Box>

              <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
                <Chip label={pet.type} sx={{ bgcolor: "#EFF6FF", color: "#7CB9E8", fontWeight: 600 }} />
                <Chip label={pet.breed || "Unknown breed"} variant="outlined" />
                <Chip label={`${pet.age} years old`} variant="outlined" />
                <Chip label={pet.gender} variant="outlined" />
              </Box>

              <Paper sx={{ p: 3, borderRadius: 3, mb: 3, bgcolor: "#F8FAFC" }}>
                <Typography variant="h6" fontWeight={600} mb={2} color="#1E293B">
                  About {pet.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  {pet.description || "No description available for this pet."}
                </Typography>
              </Paper>

              <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PetsIcon sx={{ color: "#7CB9E8" }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Type</Typography>
                        <Typography fontWeight={600}>{pet.type}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AccessTimeIcon sx={{ color: "#7CB9E8" }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Age</Typography>
                        <Typography fontWeight={600}>{pet.age} years</Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              {pet.status === "Available" ? (
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<PetsIcon />}
                  onClick={() => setOpenAdoptForm(true)}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #7CB9E8 0%, #A8D8EA 100%)",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    "&:hover": {
                      background: "linear-gradient(135deg, #5BA8D8 0%, #98C8D0 100%)",
                    },
                  }}
                >
                  Adopt {pet.name}
                </Button>
              ) : (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  This pet is no longer available for adoption.
                </Alert>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Adoption Form Dialog */}
        <Dialog open={openAdoptForm} onClose={() => setOpenAdoptForm(false)} fullWidth maxWidth="sm">
          <DialogTitle>
            <Typography variant="h5" fontWeight={700} color="#1E293B">
              Adopt {pet.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fill in your details to submit an adoption request. Your request will be reviewed by our team.
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2} sx={{ mt: 0 }}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" fontWeight={600} color="#1E293B" gutterBottom>
                  Pet Information
                </Typography>
                <Paper sx={{ p: 2, bgcolor: "#F8FAFC", borderRadius: 2 }}>
                  <Typography><strong>Name:</strong> {pet.name}</Typography>
                  <Typography><strong>Type:</strong> {pet.type} • {pet.breed}</Typography>
                  <Typography><strong>Age:</strong> {pet.age} years • {pet.gender}</Typography>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" fontWeight={600} color="#1E293B" gutterBottom>
                  Your Information
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  required
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  type="number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  multiline
                  rows={3}
                  size="small"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setOpenAdoptForm(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleAdoptSubmit}
              sx={{
                background: "linear-gradient(135deg, #7CB9E8 0%, #A8D8EA 100%)",
                fontWeight: 600,
                px: 3,
                "&:hover": {
                  background: "linear-gradient(135deg, #5BA8D8 0%, #98C8D0 100%)",
                },
              }}
            >
              Submit Adoption Request
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default PetDetail;
