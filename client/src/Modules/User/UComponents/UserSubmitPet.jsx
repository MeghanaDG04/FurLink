import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  Divider
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';

const DEFAULT_PET_IMAGE = "https://placehold.co/400x400/F1F5FC/7CB9E8?text=No+Image";
const SERVER_URL = "http://localhost:7000";

const petTypes = ["Dog", "Cat", "Bird", "Rabbit", "Hamster", "Guinea Pig", "Fish", "Other"];
const petGenders = ["Male", "Female", "Other"];

const UserSubmitPet = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    breed: '',
    age: '',
    gender: '',
    image: '',
    description: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'image' && e.target.files) {
      setSelectedFile(e.target.files[0]);
      if (e.target.files[0]) {
        setFormData(prev => ({ ...prev, image: '' }));
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.type || !formData.age) {
      setSnackbar({ open: true, message: 'Please fill in required fields', severity: 'error' });
      return;
    }

    const token = localStorage.getItem('Token');
    if (!token) {
      setSnackbar({ open: true, message: 'Please login to submit a pet', severity: 'error' });
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        type: formData.type,
        breed: formData.breed,
        age: Number(formData.age),
        gender: formData.gender,
        description: formData.description
      };

      // If file selected, upload first
      if (selectedFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('petimage', selectedFile);
        const uploadRes = await axios.post(`${SERVER_URL}/image/upload`, formDataUpload, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'auth-token': token
          }
        });
        payload.image = uploadRes.data.url;
      } else {
        payload.image = formData.image || '';
      }

      await axios.post(`${SERVER_URL}/pet/submit`, payload, {
        headers: { 'auth-token': token }
      });

      setSnackbar({ open: true, message: 'Pet submitted for approval successfully!', severity: 'success' });
      setTimeout(() => {
        navigate('/adopt/my-pets');
      }, 1500);
    } catch (err) {
      console.error("Submit error:", err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to submit pet',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#F8FAFC', py: 4 }}>
      <Container maxWidth="md">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3, color: '#7CB9E8', fontWeight: 600 }}
        >
          Back
        </Button>

        <Paper sx={{ p: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <PetsIcon sx={{ fontSize: 40, color: '#7CB9E8' }} />
            <Typography variant="h4" fontWeight={700} color="#1E293B">
              Submit Your Pet
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Share your pet with our community. Once approved, it will be visible to potential adopters.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <TextField
            fullWidth
            label="Pet Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            size="small"
            required
          />

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <FormControl fullWidth size="small" margin="normal">
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                label="Type"
                required
              >
                {petTypes.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Breed"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              size="small"
              margin="normal"
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              label="Age (years)"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              size="small"
              margin="normal"
              required
            />

            <FormControl fullWidth size="small" margin="normal">
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                label="Gender"
              >
                <MenuItem value="">
                  <em>Select Gender</em>
                </MenuItem>
                {petGenders.map(g => (
                  <MenuItem key={g} value={g}>{g}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" fontWeight={600} color="#475569" gutterBottom>
              Pet Photo *
            </Typography>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              sx={{
                width: '100%',
                py: 2,
                borderStyle: 'dashed',
                borderWidth: 2,
                borderRadius: 2,
                color: '#7CB9E8',
                '&:hover': {
                  borderColor: '#7CB9E8',
                  backgroundColor: 'rgba(124, 185, 232, 0.05)'
                }
              }}
            >
              {selectedFile ? selectedFile.name : 'Upload Image'}
              <input
                type="file"
                name="image"
                hidden
                accept="image/*"
                onChange={handleChange}
              />
            </Button>
            {!selectedFile && !formData.image && (
              <Typography variant="caption" color="error">
                Image is required
              </Typography>
            )}
          </Box>

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            size="small"
            multiline
            rows={4}
            placeholder="Tell us about your pet's personality, habits, and any special needs..."
          />

          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                background: 'linear-gradient(135deg, #7CB9E8 0%, #A8D8EA 100%)',
                fontWeight: 700,
                borderRadius: 2,
                '&:hover': {
                  background: 'linear-gradient(135deg, #5BA8D8 0%, #98C8D0 100%)'
                }
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Submit for Approval'}
            </Button>
          </Box>
        </Paper>
      </Container>

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

export default UserSubmitPet;
