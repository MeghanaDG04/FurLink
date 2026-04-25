import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, Container, Card, CardContent, Grid,
  Chip, CircularProgress, Alert, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, Divider, Snackbar, Paper
} from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

const DEFAULT_PET_IMAGE = "https://placehold.co/400x400/F1F5FC/7CB9E8?text=No+Image";

const MyAdoptions = () => {
  const navigate = useNavigate();
  const [adoptions, setAdoptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAdoption, setSelectedAdoption] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchMyAdoptions();
  }, []);

  const fetchMyAdoptions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("Token");
      if (!token) {
        setError("Please login to view your adoption requests");
        setLoading(false);
        return;
      }
      const res = await axios.get("http://localhost:7000/adopt/myadopts", {
        headers: { "auth-token": token }
      });
      setAdoptions(res.data.useradopts || []);
    } catch (err) {
      setError("Failed to fetch your adoption requests.");
      console.error("Error fetching adoptions:", err);
    } finally {
      setLoading(false);
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

  const handleViewDetails = (adoption) => {
    setSelectedAdoption(adoption);
    setOpenDetails(true);
  };

  const handleDeleteRequest = async (id) => {
    try {
      const token = localStorage.getItem("Token");
      await axios.delete(`http://localhost:7000/adopt/delete/${id}`, {
        headers: { "auth-token": token }
      });
      setSnackbar({ open: true, message: "Adoption request deleted successfully", severity: "success" });
      fetchMyAdoptions();
    } catch (err) {
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.message || "Failed to delete request", 
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

  return (
    <Box sx={{ py: 4, background: "#F8FAFC", minHeight: "100vh" }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} color="#1E293B" mb={1}>
              My Adoption Requests
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track the status of your pet adoption requests.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/adopt/browse")}
            sx={{
              background: "linear-gradient(135deg, #7CB9E8 0%, #A8D8EA 100%)",
              fontWeight: 600,
              borderRadius: 2,
              "&:hover": {
                background: "linear-gradient(135deg, #5BA8D8 0%, #98C8D0 100%)",
              },
            }}
          >
            Browse Pets
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* Adoptions List */}
        {adoptions.length > 0 ? (
          <Grid container spacing={3}>
            {adoptions.map((adoption) => (
              <Grid item xs={12} md={6} key={adoption._id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 25px rgba(124,185,232,0.2)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Box
                        sx={{
                          width: 100,
                          height: 100,
                          borderRadius: 2,
                          overflow: "hidden",
                          flexShrink: 0,
                          background: "#f0f0f0",
                        }}
                      >
                        <img
                          src={adoption.petImage || DEFAULT_PET_IMAGE}
                          alt={adoption.petName}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                          <Typography fontWeight={700} fontSize="1.1rem" color="#1E293B" noWrap>
                            {adoption.petName}
                          </Typography>
                          <Chip
                            label={adoption.status}
                            size="small"
                            color={getStatusColor(adoption.status)}
                            sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {adoption.petType} • {adoption.petBreed || "Unknown breed"} • {adoption.petAge} yrs
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Requested: {new Date(adoption.requestDate).toLocaleDateString()}
                        </Typography>
                        
                        {adoption.status === "Approved" && adoption.adoptionDate && (
                          <Typography variant="caption" color="success.main" sx={{ display: "block", mt: 0.5 }}>
                            Adopted on: {new Date(adoption.adoptionDate).toLocaleDateString()}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                      <Button
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewDetails(adoption)}
                        sx={{ color: "#7CB9E8", fontWeight: 600 }}
                      >
                        View Details
                      </Button>
                      {adoption.status === "Pending" && (
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleDeleteRequest(adoption._id)}
                          sx={{ fontWeight: 600 }}
                        >
                          Cancel
                        </Button>
                      )}
                    </Box>
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
              No adoption requests yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Browse our available pets and start your adoption journey today!
            </Typography>
            <Button
              variant="contained"
              startIcon={<PetsIcon />}
              onClick={() => navigate("/adopt/browse")}
              sx={{
                background: "linear-gradient(135deg, #7CB9E8 0%, #A8D8EA 100%)",
                fontWeight: 600,
                borderRadius: 2,
                "&:hover": {
                  background: "linear-gradient(135deg, #5BA8D8 0%, #98C8D0 100%)",
                },
              }}
            >
              Browse Available Pets
            </Button>
          </Paper>
        )}

        {/* Details Dialog */}
        <Dialog open={openDetails} onClose={() => setOpenDetails(false)} fullWidth maxWidth="sm">
          <DialogTitle>Adoption Request Details</DialogTitle>
          <DialogContent dividers>
            {selectedAdoption && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <img
                      src={selectedAdoption.petImage || DEFAULT_PET_IMAGE}
                      alt={selectedAdoption.petName}
                      style={{
                        width: 120,
                        height: 120,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {selectedAdoption.petName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedAdoption.petType} • {selectedAdoption.petBreed}
                      </Typography>
                      <Chip
                        label={selectedAdoption.status}
                        size="small"
                        color={getStatusColor(selectedAdoption.status)}
                        sx={{ mt: 1, fontWeight: 600 }}
                      />
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Pet Age</Typography>
                  <Typography>{selectedAdoption.petAge} years</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Pet Gender</Typography>
                  <Typography>{selectedAdoption.petGender}</Typography>
                </Grid>

                {selectedAdoption.description && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Description</Typography>
                    <Typography>{selectedAdoption.description}</Typography>
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
                  <Typography>{selectedAdoption.adopterDetails?.fullname}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Typography>{selectedAdoption.adopterDetails?.email}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Phone</Typography>
                  <Typography>{selectedAdoption.adopterDetails?.phone}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Address</Typography>
                  <Typography>{selectedAdoption.adopterDetails?.address}</Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="caption" color="text.secondary">Request Date</Typography>
                  <Typography>
                    {new Date(selectedAdoption.requestDate).toLocaleString()}
                  </Typography>
                  {selectedAdoption.adoptionDate && (
                    <>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                        Adoption Date
                      </Typography>
                      <Typography>
                        {new Date(selectedAdoption.adoptionDate).toLocaleDateString()}
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
      </Container>
    </Box>
  );
};

export default MyAdoptions;
