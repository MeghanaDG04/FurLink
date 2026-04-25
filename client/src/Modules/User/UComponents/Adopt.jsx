import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Chip,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Alert,
  Snackbar,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container,
} from "@mui/material";
import axios from "axios";
import PetsIcon from "@mui/icons-material/Pets";
import SaveIcon from "@mui/icons-material/Save";
import VisibilityIcon from "@mui/icons-material/Visibility";

const DEFAULT_PET_IMAGE = "https://placehold.co/400x400/F1F5F9/2563EB?text=Pet+Image";

export default function Adopt() {
  const [formData, setFormData] = useState({
    petName: "",
    petType: "",
    petBreed: "",
    petAge: "",
    petGender: "",
    petImage: "",
    description: "",
    fullname: "",
    email: "",
    phone: "",
    address: "",
  });

  const [userAdopts, setUserAdopts] = useState([]);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedAdopt, setSelectedAdopt] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const petTypes = ["Dog", "Cat", "Bird", "Rabbit", "Hamster", "Guinea Pig", "Fish", "Other"];
  const petGenders = ["Male", "Female", "Other"];

  // Fetch user's adoption requests
  const fetchUserAdopts = async () => {
    try {
      const token = localStorage.getItem("Token");
      if (!token) return;
      const res = await axios.get("http://localhost:7000/adopt/myadopts", {
        headers: { "auth-token": token }
      });
      setUserAdopts(res.data.useradopts || []);
    } catch (err) {
      console.log("Error fetching user adopts:", err);
    }
  };

  useEffect(() => {
    fetchUserAdopts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("Token");
      if (!token) {
        setSnackbar({ open: true, message: "Please login to submit adoption request", severity: "error" });
        return;
      }

      const payload = {
        petName: formData.petName,
        petType: formData.petType,
        petBreed: formData.petBreed,
        petAge: Number(formData.petAge),
        petGender: formData.petGender,
        petImage: formData.petImage,
        description: formData.description,
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
      setSnackbar({ open: true, message: "Adoption request submitted successfully!", severity: "success" });
      setFormData({
        petName: "",
        petType: "",
        petBreed: "",
        petAge: "",
        petGender: "",
        petImage: "",
        description: "",
        fullname: "",
        email: "",
        phone: "",
        address: "",
      });
      fetchUserAdopts();
    } catch (err) {
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.message || "Failed to submit adoption request", 
        severity: "error" 
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "warning";
      case "Approved": return "success";
      case "Rejected": return "error";
      default: return "default";
    }
  };

  const handleViewDetails = (adopt) => {
    setSelectedAdopt(adopt);
    setOpenDetails(true);
  };

  return (
    <Box sx={{ py: 3, background: "#F8FAFC", minHeight: "100vh" }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight={700} mb={1} color="#1E293B">
          Adopt a Pet
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Give a loving home to a pet in need. Fill out the form below to start your adoption journey.
        </Typography>

        <Grid container spacing={3}>
          {/* Adoption Form */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
              <Typography variant="h6" fontWeight={600} mb={3} color="#1E293B">
                Submit Adoption Request
              </Typography>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Pet Name"
                      name="petName"
                      value={formData.petName}
                      onChange={handleChange}
                      required
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Pet Type</InputLabel>
                      <Select
                        name="petType"
                        value={formData.petType}
                        onChange={handleChange}
                        label="Pet Type"
                        required
                      >
                        {petTypes.map((type) => (
                          <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Breed"
                      name="petBreed"
                      value={formData.petBreed}
                      onChange={handleChange}
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Age (years)"
                      name="petAge"
                      type="number"
                      value={formData.petAge}
                      onChange={handleChange}
                      required
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Gender</InputLabel>
                      <Select
                        name="petGender"
                        value={formData.petGender}
                        onChange={handleChange}
                        label="Gender"
                        required
                      >
                        {petGenders.map((gender) => (
                          <MenuItem key={gender} value={gender}>{gender}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Pet Image URL"
                      name="petImage"
                      value={formData.petImage}
                      onChange={handleChange}
                      size="small"
                      placeholder="https://example.com/pet-image.jpg"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      multiline
                      rows={3}
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" fontWeight={600} mb={1} color="#1E293B">
                      Your Information
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleChange}
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
                      onChange={handleChange}
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
                      onChange={handleChange}
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
                      onChange={handleChange}
                      required
                      multiline
                      rows={2}
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<SaveIcon />}
                      fullWidth
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        fontWeight: 600,
                        "&:hover": {
                          background: "linear-gradient(135deg, #5a67d8 0%, #6b4299 100%)",
                        },
                      }}
                    >
                      Submit Adoption Request
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>

          {/* My Adoption Requests */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight={600} mb={2} color="#1E293B">
              My Adoption Requests
            </Typography>

            {userAdopts.length > 0 ? (
              userAdopts.map((adopt) => (
                <Card
                  key={adopt._id}
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: 2,
                          overflow: "hidden",
                          flexShrink: 0,
                          background: "#f0f0f0",
                        }}
                      >
                        <img
                          src={adopt.petImage || DEFAULT_PET_IMAGE}
                          alt={adopt.petName}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <Typography fontWeight={600} color="#1E293B" noWrap>
                            {adopt.petName}
                          </Typography>
                          <Chip
                            label={adopt.status}
                            size="small"
                            color={getStatusColor(adopt.status)}
                            sx={{ fontWeight: 600, fontSize: "0.7rem" }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {adopt.petType} • {adopt.petBreed || "Unknown breed"} • {adopt.petAge} yrs
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Applied: {new Date(adopt.requestDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                    <Divider sx={{ my: 1.5 }} />
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <IconButton size="small" onClick={() => handleViewDetails(adopt)}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Paper
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: 2,
                  background: "#fff",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <PetsIcon sx={{ fontSize: 60, color: "#CBD5E1", mb: 2 }} />
                <Typography color="text.secondary">
                  No adoption requests yet. Fill out the form to get started!
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>

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

        {/* Details Dialog */}
        <Dialog open={openDetails} onClose={() => setOpenDetails(false)} fullWidth maxWidth="sm">
          <DialogTitle>Adoption Request Details</DialogTitle>
          <DialogContent dividers>
            {selectedAdopt && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <img
                      src={selectedAdopt.petImage || DEFAULT_PET_IMAGE}
                      alt={selectedAdopt.petName}
                      style={{
                        width: 120,
                        height: 120,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {selectedAdopt.petName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedAdopt.petType} • {selectedAdopt.petBreed}
                      </Typography>
                      <Chip
                        label={selectedAdopt.status}
                        size="small"
                        color={getStatusColor(selectedAdopt.status)}
                        sx={{ mt: 1, fontWeight: 600 }}
                      />
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Pet Age</Typography>
                  <Typography>{selectedAdopt.petAge} years</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Pet Gender</Typography>
                  <Typography>{selectedAdopt.petGender}</Typography>
                </Grid>

                {selectedAdopt.description && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Description</Typography>
                    <Typography>{selectedAdopt.description}</Typography>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" fontWeight={600} color="#1E293B">
                    Your Information
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Full Name</Typography>
                  <Typography>{selectedAdopt.adopterDetails?.fullname}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Typography>{selectedAdopt.adopterDetails?.email}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Phone</Typography>
                  <Typography>{selectedAdopt.adopterDetails?.phone}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Address</Typography>
                  <Typography>{selectedAdopt.adopterDetails?.address}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="caption" color="text.secondary">Request Date</Typography>
                  <Typography>
                    {new Date(selectedAdopt.requestDate).toLocaleString()}
                  </Typography>
                  {selectedAdopt.adoptionDate && (
                    <>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                        Adoption Date
                      </Typography>
                      <Typography>
                        {new Date(selectedAdopt.adoptionDate).toLocaleDateString()}
                      </Typography>
                    </>
                  )}
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDetails(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
