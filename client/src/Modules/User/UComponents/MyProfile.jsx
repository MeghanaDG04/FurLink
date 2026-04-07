import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Avatar,
  InputAdornment,
  IconButton,
  Divider
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonAddOutlined from "@mui/icons-material/PersonAddOutlined";
import PersonOutline from "@mui/icons-material/PersonOutline";
import EmailOutlined from "@mui/icons-material/EmailOutlined";
import PhoneOutlined from "@mui/icons-material/PhoneOutlined";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const profileStyleSheet = document.createElement("style");
profileStyleSheet.textContent = `
  .profile-field:hover .MuiOutlinedInput-root {
    background: rgba(124, 185, 232, 0.05);
  }
  .profile-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(124, 185, 232, 0.4) !important;
  }
  .profile-card {
    transition: all 0.3s ease;
  }
  .profile-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(124, 185, 232, 0.2) !important;
  }
`;
document.head.appendChild(profileStyleSheet);

export default function MyProfile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formdata, setFormdata] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [originalData, setOriginalData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const token = localStorage.getItem("Token");
  console.log("Raw token:", token);
  console.log("Token length:", token ? token.length : 0);
  console.log("Token slice(0,50):", token ? token.slice(0,50) : "N/A");

  const viewprofile = async () => {
    if (!token) {
      console.error("No token found - user not logged in");
      return;
    }
    try {
      console.log("Fetching profile with token:", token);
      const response = await fetch(
        "http://localhost:7000/user/getprofile",
        {
          method: "GET",
          headers: {
            "auth-token": token,
          },
        }
      );

      const details = await response.json();

      if (details.udata) {
        const userData = {
          name: details.udata.name || "",
          email: details.udata.email || "",
          phone: details.udata.phone || "",
          address: details.udata.address || "",
        };
        setFormdata(userData);
        setOriginalData(userData);
      }

    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    viewprofile();
  }, []);

  const handleChange = (e) => {
    setFormdata({
      ...formdata,
      [e.target.name]: e.target.value,
    });
  };

  const updateProfile = async () => {
    try {
      console.log("Fetching profile with token:", token);
      const response = await fetch(
        "http://localhost:7000/user/updateprofile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify(formdata),
        }
      );

      const data = await response.json();
      setOriginalData(formdata);
      setIsEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

    } catch (error) {
      console.error("Update Error:", error);
    }
  };

  const handleCancel = () => {
    setFormdata(originalData);
    setIsEditing(false);
  };

  const fieldStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#7CB9E8",
      },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "#7CB9E8" },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background: "linear-gradient(180deg, #E8F4FD 0%, #FFF5EE 50%, #FFF9F0 100%)",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Paper
        className="profile-card"
        elevation={0}
        sx={{
          width: { xs: "95%", sm: "90%", md: "600px" },
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          position: "relative",
          background: "rgba(255, 255, 255, 0.97)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(124, 185, 232, 0.15)",
        }}
      >
        <IconButton
          onClick={() => navigate("/homepage")}
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            color: "#7CB9E8"
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box sx={{ position: "relative", display: "inline-block" }}>
            <Avatar
              sx={{
                mx: "auto",
                mb: 2,
                width: 80,
                height: 80,
                background: "linear-gradient(135deg, #7CB9E8 0%, #A8D8EA 100%)",
                boxShadow: "0 4px 20px rgba(124, 185, 232, 0.3)",
              }}
            >
              <PersonAddOutlined sx={{ fontSize: 40 }} />
            </Avatar>
            {success && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 8,
                  right: -5,
                  background: "#4CAF50",
                  borderRadius: "50%",
                  p: 0.5,
                  animation: "bounce 0.5s ease"
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 20, color: "#fff" }} />
              </Box>
            )}
          </Box>
          
          <Typography variant="h4" fontWeight={700} sx={{
            background: "linear-gradient(135deg, #7CB9E8, #A8D8EA)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            My Profile
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your personal information
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Full Name"
            name="name"
            value={formdata.name}
            onChange={handleChange}
            fullWidth
            disabled={!isEditing}
            sx={fieldStyle}
            className="profile-field"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutline sx={{ color: "#7CB9E8" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Email"
            name="email"
            value={formdata.email}
            onChange={handleChange}
            fullWidth
            disabled={!isEditing}
            sx={fieldStyle}
            className="profile-field"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlined sx={{ color: "#7CB9E8" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Phone"
            name="phone"
            value={formdata.phone}
            onChange={handleChange}
            fullWidth
            disabled={!isEditing}
            sx={fieldStyle}
            className="profile-field"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneOutlined sx={{ color: "#7CB9E8" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Address"
            name="address"
            value={formdata.address}
            onChange={handleChange}
            fullWidth
            disabled={!isEditing}
            multiline
            rows={2}
            sx={fieldStyle}
            className="profile-field"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HomeOutlined sx={{ color: "#7CB9E8" }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          {!isEditing ? (
            <Button
              fullWidth
              variant="contained"
              className="profile-btn"
              startIcon={<EditIcon />}
              sx={{
                background: "linear-gradient(135deg, #7CB9E8 0%, #A8D8EA 100%)",
                borderRadius: 2,
                py: 1.2,
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "0 4px 15px rgba(124, 185, 232, 0.3)",
              }}
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                sx={{
                  flex: 1,
                  borderColor: "#7CB9E8",
                  color: "#7CB9E8",
                  borderRadius: 2,
                  py: 1.2,
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#5BA8D8",
                    background: "rgba(124, 185, 232, 0.05)",
                  },
                }}
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                variant="contained"
                className="profile-btn"
                sx={{
                  flex: 2,
                  background: "linear-gradient(135deg, #7CB9E8 0%, #A8D8EA 100%)",
                  borderRadius: 2,
                  py: 1.2,
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow: "0 4px 15px rgba(124, 185, 232, 0.3)",
                }}
                onClick={updateProfile}
              >
                Save Changes
              </Button>
            </>
          )}
        </Box>
      </Paper>

      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
        `}
      </style>
    </Box>
  );
}
