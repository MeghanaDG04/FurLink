import React, { useState, useEffect } from "react";
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, Button, Chip, Grid, CircularProgress, Alert, Snackbar
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PetsIcon from "@mui/icons-material/Pets";
import axios from "axios";

const DEFAULT_PET_IMAGE = "https://placehold.co/400x400/F1F5F9/2563EB?text=No+Image";

export default function ManageAdopt() {
  const [adopts, setAdopts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openView, setOpenView] = useState(false);
  const [selectedAdopt, setSelectedAdopt] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchAdopts();
  }, []);

  const fetchAdopts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:7000/adopt/all");
      setAdopts(res.data.alladopts || []);
    } catch (err) {
      setError("Failed to fetch adoption requests.");
      console.error("Error fetching adoptions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`http://localhost:7000/adopt/admin/updatestatus/${id}`, { status });
      setSnackbar({ 
        open: true, 
        message: `Adoption request ${status.toLowerCase()} successfully`, 
        severity: status === "Approved" ? "success" : "info" 
      });
      fetchAdopts();
    } catch (err) {
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.message || "Failed to update status", 
        severity: "error" 
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this adoption request?")) {
      try {
        await axios.delete(`http://localhost:7000/adopt/delete/${id}`);
        setSnackbar({ open: true, message: "Adoption request deleted successfully", severity: "success" });
        fetchAdopts();
      } catch (err) {
        setSnackbar({ 
          open: true, 
          message: "Failed to delete request", 
          severity: "error" 
        });
      }
    }
  };

  const handleView = (adopt) => {
    setSelectedAdopt(adopt);
    setOpenView(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "warning";
      case "Approved": return "success";
      case "Rejected": return "error";
      default: return "default";
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
    <Box>
      <Typography variant="h4" fontWeight={700} mb={1} color="#1E293B">
        Manage Adoption Requests
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Review and manage all pet adoption applications. Approving a request will automatically remove the pet from available listings.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>#</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Pet</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Adopter</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Contact</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Type/Breed</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {adopts.length > 0 ? (
                adopts.map((adopt, index) => (
                  <TableRow key={adopt._id} hover>
                    <TableCell>{index + 1}</TableCell>

                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box sx={{ width: 48, height: 48, borderRadius: 2, overflow: "hidden", flexShrink: 0 }}>
                          <img
                            src={adopt.petImage || DEFAULT_PET_IMAGE}
                            alt={adopt.petName}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        </Box>
                        <Box>
                          <Typography fontWeight={600} color="#1E293B">
                            {adopt.petName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {adopt.petGender} • {adopt.petAge} yrs
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography fontWeight={500}>
                        {adopt.adopterDetails?.fullname || "N/A"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                        <Typography variant="body2">{adopt.adopterDetails?.email || "N/A"}</Typography>
                        <Typography variant="body2">{adopt.adopterDetails?.phone || "N/A"}</Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box>
                        <Typography variant="body2">{adopt.petType}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {adopt.petBreed || "Unknown"}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      {adopt.requestDate
                        ? new Date(adopt.requestDate).toLocaleDateString()
                        : "N/A"}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={adopt.status}
                        size="small"
                        color={getStatusColor(adopt.status)}
                        sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
                        <IconButton 
                          color="primary" 
                          onClick={() => handleView(adopt)} 
                          title="View Details"
                          size="small"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>

                        {adopt.status === "Pending" && (
                          <>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              onClick={() => handleStatusChange(adopt._id, "Approved")}
                              sx={{ fontWeight: 600, fontSize: "0.7rem", py: 0.5 }}
                            >
                              Approve
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => handleStatusChange(adopt._id, "Rejected")}
                              sx={{ fontWeight: 600, fontSize: "0.7rem", py: 0.5 }}
                            >
                              Reject
                            </Button>
                          </>
                        )}

                        <IconButton 
                          color="error" 
                          onClick={() => handleDelete(adopt._id)} 
                          title="Delete"
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                      <PetsIcon sx={{ fontSize: 60, color: "#CBD5E1" }} />
                      <Typography color="text.secondary">
                        No adoption requests found
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* VIEW DIALOG */}
      <Dialog open={openView} onClose={() => setOpenView(false)} fullWidth maxWidth="md">
        <DialogTitle>Adoption Request Details</DialogTitle>
        <DialogContent dividers>
          {selectedAdopt && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: "center" }}>
                  <img
                    src={selectedAdopt.petImage || DEFAULT_PET_IMAGE}
                    alt={selectedAdopt.petName}
                    style={{
                      width: "100%",
                      maxHeight: 300,
                      objectFit: "cover",
                      borderRadius: 12,
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                  <Typography variant="h5" fontWeight={700} color="#1E293B">
                    {selectedAdopt.petName}
                  </Typography>
                  <Chip
                    label={selectedAdopt.status}
                    color={getStatusColor(selectedAdopt.status)}
                    sx={{ fontWeight: 600, fontSize: "0.9rem", py: 2 }}
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {selectedAdopt.petType} • {selectedAdopt.petBreed || "Unknown breed"} • {selectedAdopt.petAge} years old • {selectedAdopt.petGender}
                </Typography>

                {selectedAdopt.description && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight={600} color="#1E293B" mb={1}>
                      About {selectedAdopt.petName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedAdopt.description}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ bgcolor: "#F8FAFC", p: 2, borderRadius: 2, mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600} color="#1E293B" mb={2}>
                    Adopter Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">Full Name</Typography>
                      <Typography>{selectedAdopt.adopterDetails?.fullname}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">Email</Typography>
                      <Typography>{selectedAdopt.adopterDetails?.email}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">Phone</Typography>
                      <Typography>{selectedAdopt.adopterDetails?.phone}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">Address</Typography>
                      <Typography>{selectedAdopt.adopterDetails?.address}</Typography>
                    </Grid>
                  </Grid>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Request Date</Typography>
                    <Typography>
                      {new Date(selectedAdopt.requestDate).toLocaleString()}
                    </Typography>
                  </Grid>
                  {selectedAdopt.adoptionDate && (
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Adoption Date</Typography>
                      <Typography>
                        {new Date(selectedAdopt.adoptionDate).toLocaleDateString()}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          {selectedAdopt && selectedAdopt.status === "Pending" && (
            <>
              <Button 
                variant="contained" 
                color="success"
                onClick={() => {
                  handleStatusChange(selectedAdopt._id, "Approved");
                  setOpenView(false);
                }}
              >
                Approve Adoption
              </Button>
              <Button 
                variant="outlined" 
                color="error"
                onClick={() => {
                  handleStatusChange(selectedAdopt._id, "Rejected");
                  setOpenView(false);
                }}
              >
                Reject Adoption
              </Button>
            </>
          )}
          <Button onClick={() => setOpenView(false)}>Close</Button>
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
    </Box>
  );
}
