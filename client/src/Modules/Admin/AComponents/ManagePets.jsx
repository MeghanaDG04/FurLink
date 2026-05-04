import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Button, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, Alert, FormControl, InputLabel, Select, MenuItem, Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PetsIcon from '@mui/icons-material/Pets';
import axios from 'axios';

const DEFAULT_PET_IMAGE = "https://placehold.co/80x80/F1F5FC/7CB9E8?text=No+Image";
const SERVER_URL = "http://localhost:7000";

export default function ManagePets() {

  const [pets, setPets] = useState([])
  const [open, setOpen] = useState(false)
  const [success, setSuccess] = useState('')
  const [editId, setEditId] = useState(null)

  const [form, setForm] = useState({
    name: '',
    type: '',
    breed: '',
    age: '',
    gender: '',
    image: '',
    description: '',
    status: 'Available'
  })

  const [selectedFile, setSelectedFile] = useState(null);

  const petTypes = ["Dog", "Cat", "Bird", "Rabbit", "Hamster", "Guinea Pig", "Fish", "Other"];
  const petGenders = ["Male", "Female", "Other"];
  const petStatuses = ["Available", "Adopted", "Pending", "Rejected"];

  // FETCH PETS
  const fetchPets = () => {
    const token = localStorage.getItem('adminToken');
    console.log('ManagePets - Token:', token ? 'Present' : 'Missing'); // Debug
    axios.get(`${SERVER_URL}/pet/admin/all`, {
      headers: { 'auth-token': token }
    })
      .then((res) => {
        setPets(res.data.pets)
      })
      .catch((err) => {
        console.error('Fetch pets error:', err.response?.status, err.response?.data);
        if (err.response?.status === 401) {
          alert('Session expired. Please login again.');
          window.location.href = '/admin/login';
        }
      })
  }

  useEffect(() => {
    fetchPets()
  }, [])

  const handleChange = (e) => {
    if (e.target.name === 'image' && e.target.files) {
      setSelectedFile(e.target.files[0]);
      if (e.target.files[0]) {
        setForm({ ...form, image: '' });
      }
    } else {
      setForm({ ...form, [e.target.name]: e.target.value })
    }
  };

  const handleEdit = (pet) => {
    setForm({
      name: pet.name,
      type: pet.type,
      breed: pet.breed || '',
      age: pet.age.toString(),
      gender: pet.gender || '',
      image: pet.image || '',
      description: pet.description || '',
      status: pet.status
    })
    setSelectedFile(null)
    setEditId(pet._id)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false);
    setEditId(null);
    setSelectedFile(null);
    setForm({
      name: '',
      type: '',
      breed: '',
      age: '',
      gender: '',
      image: '',
      description: '',
      status: 'Available'
    });
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.type || !form.age) return

    const token = localStorage.getItem('adminToken');

    const payload = {
      name: form.name,
      type: form.type,
      breed: form.breed,
      age: Number(form.age),
      gender: form.gender,
      description: form.description,
      status: form.status,
      image: form.image
    };

    const createOrUpdate = (imageUrl) => {
      const finalPayload = { ...payload, image: imageUrl || payload.image };

      if (editId) {
        return axios.put(`${SERVER_URL}/pet/update/${editId}`, finalPayload, {
          headers: { 'auth-token': token }
        });
      } else {
        return axios.post(`${SERVER_URL}/pet/create`, finalPayload, {
          headers: { 'auth-token': token }
        });
      }
    };

    const uploadAndSave = async () => {
      try {
        if (selectedFile) {
          const formData = new FormData();
          formData.append('petimage', selectedFile);
          const uploadRes = await axios.post(`${SERVER_URL}/image/upload`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'auth-token': token
            }
          });
          const imageUrl = uploadRes.data.url;
          await createOrUpdate(imageUrl);
        } else {
          await createOrUpdate(payload.image);
        }

        setSuccess(editId ? "Pet updated successfully!" : "Pet added successfully!")
        setTimeout(() => setSuccess(''), 3000)
        handleClose()
        fetchPets()
      } catch (err) {
        console.error("Save error:", err);
        setSuccess("Failed to save pet")
        setTimeout(() => setSuccess(''), 3000)
      }
    };

    uploadAndSave().catch(err => {
      console.error("Upload error:", err);
      setSuccess("Failed to save pet")
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this pet?")) {
      const token = localStorage.getItem('adminToken');
      axios.delete(`${SERVER_URL}/pet/delete/${id}`, {
        headers: { 'auth-token': token }
      })
        .then((res) => {
          fetchPets()
        })
        .catch(err => console.log(err))
    }
  }

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`${SERVER_URL}/pet/admin/approve/${id}`, {}, {
        headers: { 'auth-token': token }
      });
      setSuccess("Pet approved successfully!");
      setTimeout(() => setSuccess(''), 3000);
      fetchPets();
    } catch (err) {
      setSuccess(err.response?.data?.message || "Failed to approve pet");
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this pet submission?")) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`${SERVER_URL}/pet/admin/reject/${id}`, {}, {
        headers: { 'auth-token': token }
      });
      setSuccess("Pet rejected successfully!");
      setTimeout(() => setSuccess(''), 3000);
      fetchPets();
    } catch (err) {
      setSuccess(err.response?.data?.message || "Failed to reject pet");
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return DEFAULT_PET_IMAGE;
    if (imagePath.startsWith('http')) return imagePath;
    return `${SERVER_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'rgba(76, 175, 80, 0.15)';
      case 'Adopted': return 'rgba(158, 158, 158, 0.15)';
      case 'Pending': return 'rgba(255, 152, 0, 0.15)';
      case 'Rejected': return 'rgba(239, 68, 68, 0.15)';
      default: return 'rgba(158, 158, 158, 0.15)';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'Available': return '#2E7D32';
      case 'Adopted': return '#616161';
      case 'Pending': return '#F57C00';
      case 'Rejected': return '#D32F2F';
      default: return '#616161';
    }
  };

  const getStatusBorderColor = (status) => {
    switch (status) {
      case 'Available': return 'rgba(76, 175, 80, 0.3)';
      case 'Adopted': return 'rgba(158, 158, 158, 0.3)';
      case 'Pending': return 'rgba(255, 152, 0, 0.3)';
      case 'Rejected': return 'rgba(239, 68, 68, 0.3)';
      default: return 'rgba(158, 158, 158, 0.3)';
    }
  };

  return (
    <Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={800} color="#1E293B" mb={0.5}>
            Manage Pets
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View, add, edit, approve, or reject pet submissions
          </Typography>
        </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditId(null);
              setSelectedFile(null);
              setForm({ name: '', type: '', breed: '', age: '', gender: '', image: '', description: '', status: 'Available' });
              setOpen(true);
            }}
            sx={{
              background: 'linear-gradient(135deg, #7CB9E8 0%, #A8D8EA 100%)',
              fontWeight: 700,
              '&:hover': {
                background: 'linear-gradient(135deg, #5BA8D8 0%, #98C8D0 100%)',
              },
            }}
          >
            Add Pet
          </Button>
      </Box>

      {success && <Alert severity={success.includes('failed') || success.includes('Failed') ? 'error' : 'success'} sx={{ mb: 2 }}>{success}</Alert>}

      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <TableContainer>
          <Table>

            <TableHead>
              <TableRow sx={{ bgcolor: 'rgba(124,185,232,0.1)' }}>
                <TableCell sx={{ fontWeight: 700, color: '#1E293B' }}>#</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1E293B' }}>Pet</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1E293B' }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1E293B' }}>Breed</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1E293B' }}>Age</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1E293B' }}>Gender</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1E293B' }}>Status</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#1E293B' }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {pets.length > 0 ? (
                pets.map((pet, index) => (
                  <TableRow
                    key={pet._id}
                    sx={{
                      '&:hover': { bgcolor: 'rgba(124,185,232,0.05)' },
                      transition: 'background 0.2s'
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          component="img"
                          src={getImageUrl(pet.image)}
                          alt={pet.name}
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid rgba(124,185,232,0.2)'
                          }}
                          onError={(e) => {
                            e.target.src = DEFAULT_PET_IMAGE;
                          }}
                        />
                        <Box>
                          <Typography fontWeight={700} color="#1E293B">
                            {pet.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {pet.description ? pet.description.substring(0, 40) + (pet.description.length > 40 ? '...' : '') : 'No description'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={pet.type}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(124,185,232,0.15)',
                          color: '#7CB9E8',
                          fontWeight: 600,
                          border: '1px solid rgba(124,185,232,0.3)'
                        }}
                      />
                    </TableCell>

                    <TableCell>{pet.breed || '-'}</TableCell>

                    <TableCell>{pet.age} yrs</TableCell>

                    <TableCell>{pet.gender || '-'}</TableCell>

                    <TableCell>
                      <Chip
                        label={pet.status}
                        size="small"
                        sx={{
                          bgcolor: getStatusColor(pet.status),
                          color: getStatusTextColor(pet.status),
                          fontWeight: 600,
                          border: `1px solid ${getStatusBorderColor(pet.status)}`
                        }}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                        {pet.status === 'Pending' && (
                          <>
                            <IconButton
                              color="success"
                              onClick={() => handleApprove(pet._id)}
                              sx={{
                                bgcolor: 'rgba(76, 175, 80, 0.1)',
                                '&:hover': { bgcolor: 'rgba(76, 175, 80, 0.2)' }
                              }}
                              title="Approve Pet"
                              size="small"
                            >
                              <CheckCircleIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleReject(pet._id)}
                              sx={{
                                bgcolor: 'rgba(239, 68, 68, 0.1)',
                                '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.2)' }
                              }}
                              title="Reject Pet"
                              size="small"
                            >
                              <CancelIcon fontSize="small" />
                            </IconButton>
                          </>
                        )}

                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(pet)}
                          sx={{
                            bgcolor: 'rgba(124,185,232,0.1)',
                            '&:hover': { bgcolor: 'rgba(124,185,232,0.2)' }
                          }}
                          title="Edit Pet"
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>

                        <IconButton
                          color="error"
                          onClick={() => handleDelete(pet._id)}
                          sx={{
                            bgcolor: 'rgba(239,68,68,0.1)',
                            '&:hover': { bgcolor: 'rgba(239,68,68,0.2)' }
                          }}
                          title="Delete Pet"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <PetsIcon sx={{ fontSize: 64, color: '#CBD5E1' }} />
                      <Typography variant="h6" color="text.secondary">
                        No pets found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Add a pet to get started
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}

            </TableBody>

          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={700}>
            {editId ? "Edit Pet" : "Add New Pet"}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>

          <TextField
            fullWidth
            label="Pet Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            margin="dense"
            size="small"
            required
          />

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <FormControl fullWidth size="small" margin="dense">
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={form.type}
                onChange={handleChange}
                label="Type"
                required
              >
                {petTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Breed"
              name="breed"
              value={form.breed}
              onChange={handleChange}
              size="small"
              margin="dense"
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="Age (years)"
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
              size="small"
              margin="dense"
              required
            />

            <FormControl fullWidth size="small" margin="dense">
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                label="Gender"
              >
                {petGenders.map((g) => (
                  <MenuItem key={g} value={g}>{g}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <TextField
            fullWidth
            type="file"
            name="image"
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
            inputProps={{ accept: 'image/*' }}
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            multiline
            rows={3}
            size="small"
            margin="dense"
          />

          <FormControl fullWidth size="small" margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={form.status}
              onChange={handleChange}
              label="Status"
            >
              {petStatuses.map((status) => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </Select>
          </FormControl>

        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              background: 'linear-gradient(135deg, #7CB9E8 0%, #A8D8EA 100%)',
              fontWeight: 700,
              '&:hover': {
                background: 'linear-gradient(135deg, #5BA8D8 0%, #98C8D0 100%)',
              },
            }}
          >
            {editId ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  )
}
