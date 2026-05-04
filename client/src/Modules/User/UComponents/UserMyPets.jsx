import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Container, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Button, Chip, CircularProgress, Alert, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select,
  MenuItem, Snackbar
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';

const DEFAULT_PET_IMAGE = "https://placehold.co/80x80/F1F5FC/7CB9E8?text=No+Image";
const SERVER_URL = "http://localhost:7000";

const petTypes = ["Dog", "Cat", "Bird", "Rabbit", "Hamster", "Guinea Pig", "Fish", "Other"];
const petGenders = ["Male", "Female", "Other"];

const UserMyPets = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    type: '',
    breed: '',
    age: '',
    gender: '',
    description: '',
    image: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchMyPets();
  }, []);

  const fetchMyPets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('Token');
      const res = await axios.get(`${SERVER_URL}/pet/my-pets`, {
        headers: { 'auth-token': token }
      });
      if (res.data.success) {
        setPets(res.data.pets || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch pets');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pet) => {
    setSelectedPet(pet);
    setEditForm({
      name: pet.name,
      type: pet.type,
      breed: pet.breed || '',
      age: pet.age.toString(),
      gender: pet.gender || '',
      description: pet.description || '',
      image: pet.image || ''
    });
    setSelectedFile(null);
    setOpenEdit(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
    if (name === 'image' && e.target.files) {
      setSelectedFile(e.target.files[0]);
      if (e.target.files[0]) {
        setEditForm(prev => ({ ...prev, image: '' }));
      }
    }
  };

  const handleEditSave = async () => {
    if (!editForm.name.trim() || !editForm.type || !editForm.age) {
      setSnackbar({ open: true, message: 'Please fill required fields', severity: 'error' });
      return;
    }

    try {
      const token = localStorage.getItem('Token');
      const payload = {
        name: editForm.name,
        type: editForm.type,
        breed: editForm.breed,
        age: Number(editForm.age),
        gender: editForm.gender,
        description: editForm.description
      };

      if (selectedFile) {
        const formData = new FormData();
        formData.append('petimage', selectedFile);
        const uploadRes = await axios.post(`${SERVER_URL}/image/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'auth-token': token
          }
        });
        payload.image = uploadRes.data.url;
      } else {
        payload.image = editForm.image || '';
      }

      await axios.put(`${SERVER_URL}/pet/update-submission/${selectedPet._id}`, payload, {
        headers: { 'auth-token': token }
      });

      setSnackbar({ open: true, message: 'Pet updated successfully', severity: 'success' });
      setOpenEdit(false);
      fetchMyPets();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to update pet',
        severity: 'error'
      });
    }
  };

  const handleWithdraw = async (id) => {
    if (!window.confirm('Are you sure you want to withdraw this pet submission?')) return;

    try {
      const token = localStorage.getItem('Token');
      await axios.delete(`${SERVER_URL}/pet/withdraw/${id}`, {
        headers: { 'auth-token': token }
      });
      setSnackbar({ open: true, message: 'Pet submission withdrawn', severity: 'success' });
      fetchMyPets();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to withdraw',
        severity: 'error'
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Available': return 'success';
      case 'Adopted': return 'info';
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };

  const getImageUrl = (img) => {
    if (!img) return DEFAULT_PET_IMAGE;
    if (img.startsWith('http')) return img;
    return `${SERVER_URL}${img.startsWith('/') ? '' : '/'}${img}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#7CB9E8' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#F8FAFC', py: 4 }}>
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/adopt')}
          sx={{ mb: 3, color: '#7CB9E8', fontWeight: 600 }}
        >
          Back to Browse
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" fontWeight={800} color="#1E293B" mb={0.5}>
              My Pet Submissions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track and manage your pet submissions
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<PetsIcon />}
            onClick={() => navigate('/adopt/submit-pet')}
            sx={{
              background: 'linear-gradient(135deg, #7CB9E8 0%, #A8D8EA 100%)',
              fontWeight: 700,
              '&:hover': {
                background: 'linear-gradient(135deg, #5BA8D8 0%, #98C8D0 100%)'
              }
            }}
          >
            Add New Pet
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {pets.length > 0 ? (
          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'rgba(124,185,232,0.1)' }}>
                  <TableCell sx={{ fontWeight: 700, color: '#1E293B' }}>Pet</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1E293B' }}>Details</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1E293B' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1E293B' }}>Submitted</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: '#1E293B' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pets.map((pet) => (
                  <TableRow key={pet._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          component="img"
                          src={getImageUrl(pet.image)}
                          alt={pet.name}
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid rgba(124,185,232,0.2)'
                          }}
                          onError={(e) => { e.target.src = DEFAULT_PET_IMAGE; }}
                        />
                        <Typography fontWeight={600}>{pet.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {pet.breed || 'Unknown breed'} • {pet.age} years • {pet.gender}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={pet.status}
                        size="small"
                        color={getStatusColor(pet.status)}
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(pet.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => {
                            if (pet.status === 'Available') {
                              navigate(`/adopt/pet/${pet._id}`);
                            }
                          }}
                          disabled={pet.status !== 'Available'}
                          title={pet.status === 'Available' ? 'View Pet' : 'Not available yet'}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        {pet.status === 'Pending' && (
                          <>
                            <IconButton size="small" onClick={() => handleEdit(pet)} color="primary">
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleWithdraw(pet._id)} color="error">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Paper sx={{ p: 6, borderRadius: 3, textAlign: 'center' }}>
            <PetsIcon sx={{ fontSize: 64, color: '#CBD5E1' }} />
            <Typography variant="h6" color="text.secondary" mt={2}>
              No pet submissions yet
            </Typography>
            <Button
              variant="contained"
              startIcon={<PetsIcon />}
              onClick={() => navigate('/adopt/submit-pet')}
              sx={{ mt: 3, borderRadius: 2 }}
            >
              Submit Your First Pet
            </Button>
          </Paper>
        )}
      </Container>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          <Typography variant="h6" fontWeight={700}>Edit Pet Submission</Typography>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            label="Pet Name"
            name="name"
            value={editForm.name}
            onChange={handleEditChange}
            margin="dense"
            size="small"
            required
          />
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <FormControl fullWidth size="small" margin="dense">
              <InputLabel>Type</InputLabel>
              <Select name="type" value={editForm.type} onChange={handleEditChange} label="Type" required>
                {petTypes.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Breed"
              name="breed"
              value={editForm.breed}
              onChange={handleEditChange}
              size="small"
              margin="dense"
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="Age"
              name="age"
              type="number"
              value={editForm.age}
              onChange={handleEditChange}
              size="small"
              margin="dense"
              required
            />
            <FormControl fullWidth size="small" margin="dense">
              <InputLabel>Gender</InputLabel>
              <Select name="gender" value={editForm.gender} onChange={handleEditChange} label="Gender">
                {petGenders.map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUploadIcon />}
            sx={{ mt: 2, borderStyle: 'dashed' }}
            fullWidth
          >
            {selectedFile ? 'Change Image' : 'Upload Image'}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleEditChange}
            />
          </Button>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={editForm.description}
            onChange={handleEditChange}
            margin="dense"
            size="small"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleEditSave}
            sx={{
              background: 'linear-gradient(135deg, #7CB9E8 0%, #A8D8EA 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #5BA8D8 0%, #98C8D0 100%)' }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserMyPets;
