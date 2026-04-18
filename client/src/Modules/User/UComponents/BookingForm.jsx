import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Grid,
  Avatar,
  Alert,
  IconButton,
  InputAdornment,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PetsIcon from "@mui/icons-material/Pets";

const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .booking-btn:hover {
    background: linear-gradient(135deg, #FF8C42 0%, #FFA030 100%) !important;
    box-shadow: 0 6px 20px rgba(255,154,86,0.5) !important;
    transform: translateY(-2px);
  }
`;
document.head.appendChild(styleSheet);

export default function BookingForm() {
  const navigate = useNavigate();

  const [formdata, setFormdata] = useState({
    fullname: "",
    email: "",
    phone: "",
    address: "",
    productID: "",
    quantity: 1,
  });

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [validFields, setValidFields] = useState({
    fullname: false,
    email: false,
    phone: false,
    address: false,
    productID: false,
    quantity: false,
  });

  useEffect(() => {
    const savedProduct = localStorage.getItem("selectedProduct");
    if (savedProduct) {
      try {
        const parsed = JSON.parse(savedProduct);
        setProduct(parsed);
        setFormdata((prev) => ({
          ...prev,
          productID: parsed._id || "",
        }));
      } catch (e) {
        console.log("Error parsing product:", e);
      }
    }
  }, []);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^[6-9]\d{9}$/;
    return re.test(phone);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata({ ...formdata, [name]: value });
    setErrorMsg("");
    setSuccessMsg("");

    if (name === "fullname") {
      setValidFields((prev) => ({ ...prev, fullname: value.trim().length >= 2 }));
    }
    if (name === "email") {
      setValidFields((prev) => ({ ...prev, email: validateEmail(value) }));
    }
    if (name === "phone") {
      setValidFields((prev) => ({ ...prev, phone: validatePhone(value) }));
    }
    if (name === "address") {
      setValidFields((prev) => ({ ...prev, address: value.trim().length >= 10 }));
    }
    if (name === "productID") {
      setValidFields((prev) => ({ ...prev, productID: value.trim().length > 0 }));
    }
    if (name === "quantity") {
      const qty = parseInt(value) || 0;
      setValidFields((prev) => ({ ...prev, quantity: qty >= 1 }));
    }
  };

  const handleQuantityChange = (delta) => {
    const newQty = formdata.quantity + delta;
    if (newQty >= 1) {
      setFormdata({ ...formdata, quantity: newQty });
      setValidFields((prev) => ({ ...prev, quantity: newQty >= 1 }));
    }
  };

  const calculateTotal = () => {
    if (!product?.price) return 0;
    return product.price * formdata.quantity;
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("Token");
    if (!token) {
      setErrorMsg("Please login to place a booking");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    const errors = [];
    if (!formdata.fullname.trim()) errors.push("Full name");
    if (!validateEmail(formdata.email)) errors.push("Valid email");
    if (!validatePhone(formdata.phone)) errors.push("Valid 10-digit phone");
    if (!formdata.address.trim() || formdata.address.trim().length < 5)
      errors.push("Complete address (at least 10 characters)");
    if (!formdata.productID) errors.push("Product ID");
    if (formdata.quantity < 1) errors.push("Quantity (minimum 1)");

    if (errors.length > 0) {
      setErrorMsg(`Please fill: ${errors.join(", ")}`);
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const bookingData = {
        fullname: formdata.fullname,
        email: formdata.email,
        phone: parseInt(formdata.phone),
        address: formdata.address,
        productID: formdata.productID,
        quantity: formdata.quantity,
        totalamount: calculateTotal(),
      };

      const res = await axios.post(
        "http://localhost:7000/booking/createbooking",
        bookingData,
        {
          headers: {
            "auth-token": token,
          },
        }
      );

      console.log("Booking response:", res.data);
      setSuccessMsg("Booking placed successfully!");
      localStorage.removeItem("selectedProduct");
      
      setTimeout(() => {
        navigate("/homepage");
      }, 2000);
    } catch (err) {
      console.log("Booking error:", err);
      const message = err.response?.data?.message || "";
      if (message.toLowerCase().includes("token")) {
        setErrorMsg("Session expired. Please login again");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setErrorMsg(message || "Failed to place booking. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fieldSx = (isValid, fieldName) => ({
    "& .MuiOutlinedInput-root": {
      borderRadius: 3,
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#7CB9E8" },
      ...(isValid && validFields[fieldName]
        ? { "& fieldset": { borderColor: "#4CAF50" } }
        : {}),
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "#7CB9E8" },
  });

  const ValidationIcon = ({ isValid, fieldName }) =>
    formdata[fieldName] ? (
      isValid ? (
        <CheckCircleIcon sx={{ color: "#4CAF50", fontSize: 20 }} />
      ) : (
        <CancelIcon sx={{ color: "#FF6B6B", fontSize: 20 }} />
      )
    ) : null;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            mr: 1,
            background: "#f5f5f5",
            "&:hover": { background: "#e0e0e0" },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={700} sx={{ color: "#2D3748" }}>
          Book Your Product
        </Typography>
      </Box>

      <Paper
        elevation={4}
        sx={{
          borderRadius: 5,
          overflow: "hidden",
          background: "rgba(255,255,255,0.95)",
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(135deg, #FF9A56 0%, #FFB347 100%)",
            py: 3,
            px: 4,
            textAlign: "center",
          }}
        >
          <Avatar
            sx={{
              mx: "auto",
              mb: 1.5,
              width: 60,
              height: 60,
              background: "rgba(255,255,255,0.2)",
              border: "3px solid rgba(255,255,255,0.5)",
            }}
          >
            <PetsIcon sx={{ fontSize: 32, color: "#fff" }} />
          </Avatar>
          <Typography variant="h5" fontWeight={700} sx={{ color: "#fff" }}>
            Place Your Booking
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)", mt: 0.5 }}>
            Fill in your details to complete the order
          </Typography>
        </Box>

        <Box sx={{ p: { xs: 3, sm: 4 } }}>
          {errorMsg && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMsg}
            </Alert>
          )}

          {successMsg && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {successMsg}
            </Alert>
          )}

          {product && (
            <Box
              sx={{
                mb: 3,
                p: 2,
                bgcolor: "#f0f7ff",
                borderRadius: 3,
                border: "1px solid #7CB9E8",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  component="img"
                  src={
                    product.productimage
                      ? `http://localhost:7000/image/${product.productimage}`
                      : "/fallback.jpg"
                  }
                  alt={product.name}
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 2,
                    objectFit: "contain",
                    bgcolor: "#fff",
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Chip
                    label={product.category?.category || "Pet Supplies"}
                    size="small"
                    color="secondary"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="h6" fontWeight={600}>
                    {product.name}
                  </Typography>
                  <Typography variant="h6" fontWeight={700} sx={{ color: "#1976d2" }}>
                    ₹{product.price}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Full Name"
                name="fullname"
                fullWidth
                value={formdata.fullname}
                onChange={handleChange}
                sx={fieldSx(validFields.fullname, "fullname")}
                placeholder="Enter your full name"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlinedIcon sx={{ color: "#FF9A56" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <ValidationIcon isValid={validFields.fullname} fieldName="fullname" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="email"
                fullWidth
                type="email"
                value={formdata.email}
                onChange={handleChange}
                sx={fieldSx(validFields.email, "email")}
                placeholder="Enter your email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ color: "#FF9A56" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <ValidationIcon isValid={validFields.email} fieldName="email" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                name="phone"
                fullWidth
                value={formdata.phone}
                onChange={handleChange}
                sx={fieldSx(validFields.phone, "phone")}
                placeholder="10-digit mobile number"
                inputProps={{ maxLength: 10 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneOutlinedIcon sx={{ color: "#FF9A56" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <ValidationIcon isValid={validFields.phone} fieldName="phone" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Product ID"
                name="productID"
                fullWidth
                value={formdata.productID}
                onChange={handleChange}
                sx={fieldSx(validFields.productID, "productID")}
                placeholder="Enter product ID"
                disabled={!!product}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ShoppingBagOutlinedIcon sx={{ color: "#FF9A56" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Delivery Address"
                name="address"
                fullWidth
                multiline
                rows={3}
                value={formdata.address}
                onChange={handleChange}
                sx={fieldSx(validFields.address, "address")}
                placeholder="Enter your complete delivery address"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1.5 }}>
                      <HomeOutlinedIcon sx={{ color: "#FF9A56" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end" sx={{ alignSelf: "flex-start", mt: 1.5 }}>
                      <ValidationIcon isValid={validFields.address} fieldName="address" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  bgcolor: "#f8fafc",
                  borderRadius: 3,
                }}
              >
                <Typography variant="subtitle1" fontWeight={600}>
                  Quantity:
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #ddd",
                    borderRadius: 2,
                  }}
                >
                  <IconButton
                    onClick={() => handleQuantityChange(-1)}
                    disabled={formdata.quantity <= 1}
                    size="small"
                  >
                    <RemoveIcon />
                  </IconButton>
                  <TextField
                    name="quantity"
                    value={formdata.quantity}
                    onChange={handleChange}
                    size="small"
                    sx={{
                      width: 60,
                      "& .MuiInputBase-input": { textAlign: "center", p: 1 },
                    }}
                  />
                  <IconButton onClick={() => handleQuantityChange(1)} size="small">
                    <AddIcon />
                  </IconButton>
                </Box>

                <Box sx={{ flex: 1, textAlign: "right" }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Amount:
                  </Typography>
                  <Typography variant="h5" fontWeight={700} sx={{ color: "#1976d2" }}>
                    ₹{calculateTotal()}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  p: 2,
                  bgcolor: "#fff7ed",
                  borderRadius: 2,
                  mb: 2,
                }}
              >
                <Chip label="Pending" color="warning" size="small" />
                <Typography variant="body2">
                  Your booking status will be "Pending" until confirmed
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                fullWidth
                className="booking-btn"
                onClick={handleSubmit}
                disabled={loading}
                sx={{
                  py: 2,
                  background: "linear-gradient(135deg, #FF9A56 0%, #FFB347 100%)",
                  borderRadius: 3,
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  textTransform: "none",
                  boxShadow: "0 4px 15px rgba(255,154,86,0.4)",
                }}
              >
                {loading ? "Processing..." : "Confirm Booking"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}