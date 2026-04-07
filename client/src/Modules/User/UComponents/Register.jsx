import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  Avatar,
  InputAdornment,
  IconButton,
  LinearProgress,
  Link,
} from "@mui/material";

import PersonAddOutlined from "@mui/icons-material/PersonAddOutlined";
import PersonOutline from "@mui/icons-material/PersonOutline";
import EmailOutlined from "@mui/icons-material/EmailOutlined";
import LockOutlined from "@mui/icons-material/LockOutlined";
import PhoneOutlined from "@mui/icons-material/PhoneOutlined";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Pets from "@mui/icons-material/Pets";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";
import axios from "axios";

const registerStyleSheet = document.createElement("style");
registerStyleSheet.textContent = `
  .register-btn:hover {
    background: linear-gradient(135deg, #5BA8D8 0%, #98C8E0 100%) !important;
    box-shadow: 0 6px 20px rgba(124, 185, 232, 0.5) !important;
    transform: translateY(-2px);
  }
`;
document.head.appendChild(registerStyleSheet);

const PawPrint = ({ style }) => (
  <svg width="50" height="50" viewBox="0 0 50 50" style={style}>
    <ellipse cx="25" cy="38" rx="12" ry="10" fill="rgba(255,255,255,0.2)" />
    <ellipse cx="10" cy="24" rx="6" ry="7" fill="rgba(255,255,255,0.15)" />
    <ellipse cx="25" cy="15" rx="6" ry="7" fill="rgba(255,255,255,0.15)" />
    <ellipse cx="40" cy="24" rx="6" ry="7" fill="rgba(255,255,255,0.15)" />
  </svg>
);

const Mascot = ({ state }) => {
  return (
    <Box
      sx={{
        position: "absolute",
        right: -70,
        bottom: 20,
        width: 80,
        height: 80,
        animation: state === "success" ? "celebrate 0.5s ease infinite" : "bounce 1s ease infinite",
        display: { xs: "none", md: "block" },
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #7CB9E8, #A8D8EA)",
          borderRadius: "50% 50% 45% 45%",
          position: "relative",
          boxShadow: "0 4px 15px rgba(124, 185, 232, 0.4)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 18,
            left: 16,
            width: 14,
            height: 16,
            background: "#fff",
            borderRadius: "50%",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 18,
            right: 16,
            width: 14,
            height: 16,
            background: "#fff",
            borderRadius: "50%",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 30,
            left: 26,
            width: 10,
            height: 10,
            background: "#333",
            borderRadius: "50%",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 30,
            right: 26,
            width: 10,
            height: 10,
            background: "#333",
            borderRadius: "50%",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 40,
            left: 28,
            width: 24,
            height: 12,
            background: "#FF6B6B",
            borderRadius: "0 0 50% 50%",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: -20,
            left: 20,
            width: 15,
            height: 25,
            background: "transparent",
            borderRight: "3px solid #7CB9E8",
            borderRadius: "50%",
            transform: "rotate(20deg)",
          }}
        />
      </Box>
      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          @keyframes celebrate {
            0%, 100% { transform: rotate(-10deg) scale(1.1); }
            50% { transform: rotate(10deg) scale(1.1); }
          }
        `}
      </style>
    </Box>
  );
};

const PawLoader = () => (
  <Box
    sx={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(255,255,255,0.95)",
      zIndex: 9999,
    }}
  >
    <Box sx={{ position: "relative", width: 100, height: 100 }}>
      {[0, 1, 2, 3].map((i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "#7CB9E8",
            animation: `bounce 0.8s ease-in-out ${i * 0.2}s infinite`,
            left: i === 0 || i === 3 ? (i === 0 ? 8 : 68) : 30,
            top: i < 2 ? 8 : 42,
          }}
        />
      ))}
      <Box
        sx={{
          position: "absolute",
          width: 50,
          height: 38,
          borderRadius: "50%",
          background: "#7CB9E8",
          left: 25,
          top: 42,
          animation: `bounceCenter 0.8s ease-in-out infinite`,
        }}
      />
    </Box>
    <Typography sx={{ mt: 3, color: "#7CB9E8", fontWeight: 700, fontSize: "1.2rem" }}>
      Creating your account...
    </Typography>
    <style>
      {`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-18px); }
        }
        @keyframes bounceCenter {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(0.95); }
        }
      `}
    </style>
  </Box>
);

const SuccessAnimation = ({ onComplete }) => {
  const pawPositions = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    left: `${i * 25 - 12}%`,
    delay: i * 0.15,
  }));

  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg, #E8F4FD 0%, #FFF5EE 100%)",
        zIndex: 9999,
      }}
    >
      {pawPositions.map((paw) => (
        <Box
          key={paw.id}
          sx={{
            position: "absolute",
            fontSize: 40,
            animation: `walkPaw 1s ease-out ${paw.delay}s forwards`,
            left: paw.left,
            top: "60%",
          }}
        >
          🐾
        </Box>
      ))}
      <Typography sx={{ fontSize: "2rem", fontWeight: 800, color: "#7CB9E8", animation: "fadeInScale 0.5s ease" }}>
        🎉 Welcome to FurLink!
      </Typography>
      <Typography sx={{ mt: 2, color: "#FF9A56", fontSize: "1.1rem" }}>
        Your account has been created successfully
      </Typography>
      <style>
        {`
          @keyframes walkPaw {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
          }
          @keyframes fadeInScale {
            0% { transform: scale(0.5); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
};

const passwordRequirements = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "Contains a number", test: (p) => /\d/.test(p) },
  { label: "Contains uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "Contains special character", test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

export default function Register() {
  const [formdata, setFormdata] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [mascotState, setMascotState] = useState("idle");
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);

  const [validFields, setValidFields] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
    phone: false,
  });

  const pawPrints = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 92}%`,
    top: `${Math.random() * 92}%`,
    rotation: Math.random() * 360,
    delay: Math.random() * 2,
  }));

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes pulse {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(1.1); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^\d{10,15}$/.test(phone.replace(/\D/g, ""));
  const getPasswordStrength = () => {
    const passed = passwordRequirements.filter((r) => r.test(formdata.password)).length;
    if (passed <= 1) return { level: "Weak", color: "#FF6B6B", value: 25 };
    if (passed <= 2) return { level: "Medium", color: "#FFB347", value: 50 };
    if (passed <= 3) return { level: "Good", color: "#7CB9E8", value: 75 };
    return { level: "Strong", color: "#4CAF50", value: 100 };
  };

  const passwordStrength = getPasswordStrength();
  const passwordsMatch = formdata.password && formdata.confirmPassword && formdata.password === formdata.confirmPassword;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata({ ...formdata, [name]: value });
    setErrorMessage("");

    if (name === "name") setValidFields((prev) => ({ ...prev, name: value.length >= 2 }));
    if (name === "email") setValidFields((prev) => ({ ...prev, email: validateEmail(value) }));
    if (name === "password") {
      setValidFields((prev) => ({ ...prev, password: passwordRequirements.every((r) => r.test(value)) }));
    }
    if (name === "confirmPassword") {
      setValidFields((prev) => ({ ...prev, confirmPassword: value === formdata.password && value.length > 0 }));
    }
    if (name === "phone") setValidFields((prev) => ({ ...prev, phone: validatePhone(value) }));
  };

  const handleFocus = (field) => {
    if (field === "password") {
      setShowPasswordStrength(true);
      setMascotState("typing");
    }
  };

  const handleBlur = (field) => {
    if (field === "password") {
      setShowPasswordStrength(false);
      setMascotState("idle");
    }
  };

  const handleregister = async () => {
    if (!formdata.name || !formdata.email || !formdata.password || !formdata.phone || !formdata.address) {
      setErrorMessage("Please fill all required fields");
      setMascotState("idle");
      return;
    }

    if (!validateEmail(formdata.email)) {
      setErrorMessage("Please enter a valid email format");
      return;
    }

    if (!validatePhone(formdata.phone)) {
      setErrorMessage("Please enter a valid phone number (10-15 digits)");
      return;
    }

    if (!passwordRequirements.every((req) => req.test(formdata.password))) {
      setErrorMessage("Please meet all password requirements");
      return;
    }

    if (!passwordsMatch) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (!termsAccepted) {
      setErrorMessage("Please accept the Terms & Conditions and Privacy Policy");
      return;
    }

    setErrorMessage("");

    try {
      setLoading(true);
      await axios.post("http://localhost:7000/user/registeruser", {
        name: formdata.name,
        email: formdata.email,
        password: formdata.password,
        phone: formdata.phone,
        address: formdata.address,
      });

      setMascotState("success");
      setShowSuccess(true);
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
      setMascotState("idle");
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle = (isValid, fieldName) => ({
    "& .MuiOutlinedInput-root": {
      borderRadius: 3,
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#7CB9E8" },
      ...(isValid && validFields[fieldName] ? { "& fieldset": { borderColor: "#4CAF50" } } : {}),
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "#7CB9E8" },
  });

  if (showSuccess) {
    return <SuccessAnimation onComplete={() => (window.location.href = "/login")} />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, sm: 3 },
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(180deg, #E8F4FD 0%, #FFF5EE 50%, #FFF9F0 100%)",
      }}
    >
      {pawPrints.map((paw) => (
        <Box
          key={paw.id}
          sx={{
            position: "absolute",
            left: paw.left,
            top: paw.top,
            transform: `rotate(${paw.rotation}deg)`,
            opacity: 0.4,
            zIndex: 0,
            animation: `pulse 3s ease-in-out ${paw.delay}s infinite`,
          }}
        >
          <PawPrint />
        </Box>
      ))}

      {loading && <PawLoader />}

      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 500,
          borderRadius: 5,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(124, 185, 232, 0.3)",
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(135deg, #7CB9E8 0%, #A8D8EA 100%)",
            py: 4,
            px: 3,
            textAlign: "center",
            position: "relative",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -25,
              right: -25,
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
            }}
          />
          <Avatar
            sx={{
              mx: "auto",
              mb: 1.5,
              width: 70,
              height: 70,
              background: "rgba(255,255,255,0.2)",
              border: "3px solid rgba(255,255,255,0.5)",
            }}
          >
            <Pets sx={{ fontSize: 40, color: "#fff" }} />
          </Avatar>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#fff" }}>
            FurLink
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)", mt: 0.5 }}>
            The Complete World for Pet Lovers
          </Typography>
        </Box>

        <Box sx={{ p: { xs: 3, sm: 4 }, position: "relative" }}>
          <Mascot state={mascotState} />

          <Typography variant="h5" textAlign="center" fontWeight={700} color="#2D3748" mb={0.5}>
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
            Join our community of pet lovers
          </Typography>

          {errorMessage && (
            <Box
              sx={{
                mb: 2,
                p: 1.5,
                bgcolor: "rgba(255,107,107,0.1)",
                borderRadius: 2,
                border: "1px solid rgba(255,107,107,0.3)",
              }}
            >
              <Typography color="error" fontSize="14px" fontWeight={500}>
                {errorMessage}
              </Typography>
            </Box>
          )}

          <TextField
            label="Full Name"
            name="name"
            fullWidth
            margin="normal"
            onChange={handleChange}
            value={formdata.name}
            sx={fieldStyle(validFields.name, "name")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutline sx={{ color: "#7CB9E8" }} />
                </InputAdornment>
              ),
              endAdornment: formdata.name && (
                <InputAdornment position="end">
                  {validFields.name ? (
                    <CheckCircle sx={{ color: "#4CAF50", fontSize: 20 }} />
                  ) : (
                    <Cancel sx={{ color: "#FF6B6B", fontSize: 20 }} />
                  )}
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Email"
            name="email"
            fullWidth
            margin="normal"
            onChange={handleChange}
            value={formdata.email}
            sx={fieldStyle(validFields.email, "email")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlined sx={{ color: "#7CB9E8" }} />
                </InputAdornment>
              ),
              endAdornment: formdata.email && (
                <InputAdornment position="end">
                  {validFields.email ? (
                    <CheckCircle sx={{ color: "#4CAF50", fontSize: 20 }} />
                  ) : (
                    <Cancel sx={{ color: "#FF6B6B", fontSize: 20 }} />
                  )}
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            onChange={handleChange}
            onFocus={() => handleFocus("password")}
            onBlur={() => handleBlur("password")}
            value={formdata.password}
            sx={fieldStyle(validFields.password, "password")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined sx={{ color: "#7CB9E8" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: "#7CB9E8" }}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {showPasswordStrength && formdata.password && (
            <Box sx={{ mt: 1.5, mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  Password Strength:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700, color: passwordStrength.color }}
                >
                  {passwordStrength.level} 🔴🟡🟢
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={passwordStrength.value}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: "#E8F4FD",
                  "& .MuiLinearProgress-bar": { background: passwordStrength.color },
                }}
              />
              {passwordRequirements.map((req, index) => {
                const isValid = req.test(formdata.password);
                return (
                  <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                    {isValid ? (
                      <CheckCircle sx={{ fontSize: 16, color: "#4CAF50" }} />
                    ) : (
                      <Cancel sx={{ fontSize: 16, color: "#ccc" }} />
                    )}
                    <Typography
                      variant="caption"
                      sx={{ color: isValid ? "#4CAF50" : "#999", fontWeight: isValid ? 600 : 400 }}
                    >
                      {req.label}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          )}

          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            onChange={handleChange}
            value={formdata.confirmPassword}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#7CB9E8" },
                ...(passwordsMatch && formdata.confirmPassword ? { "& fieldset": { borderColor: "#4CAF50" } } : {}),
              },
              "& .MuiInputLabel-root.Mui-focused": { color: "#7CB9E8" },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined sx={{ color: "#7CB9E8" }} />
                </InputAdornment>
              ),
              endAdornment: formdata.confirmPassword && (
                <InputAdornment position="end">
                  {passwordsMatch ? (
                    <CheckCircle sx={{ color: "#4CAF50", fontSize: 20 }} />
                  ) : (
                    <Cancel sx={{ color: "#FF6B6B", fontSize: 20 }} />
                  )}
                </InputAdornment>
              ),
            }}
          />
          {formdata.confirmPassword && (
            <Typography
              variant="caption"
              sx={{ color: passwordsMatch ? "#4CAF50" : "#FF6B6B", fontWeight: 600, display: "block", mt: 0.5, mb: 1 }}
            >
              {passwordsMatch ? "✓ Passwords match!" : "✗ Passwords do not match"}
            </Typography>
          )}

          <TextField
            label="Phone Number"
            name="phone"
            fullWidth
            margin="normal"
            onChange={handleChange}
            value={formdata.phone}
            sx={fieldStyle(validFields.phone, "phone")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneOutlined sx={{ color: "#7CB9E8" }} />
                </InputAdornment>
              ),
              endAdornment: formdata.phone && (
                <InputAdornment position="end">
                  {validFields.phone ? (
                    <CheckCircle sx={{ color: "#4CAF50", fontSize: 20 }} />
                  ) : (
                    <Cancel sx={{ color: "#FF6B6B", fontSize: 20 }} />
                  )}
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Address"
            name="address"
            fullWidth
            margin="normal"
            onChange={handleChange}
            value={formdata.address}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HomeOutlined sx={{ color: "#7CB9E8" }} />
                </InputAdornment>
              ),
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                sx={{ color: "#7CB9E8" }}
              />
            }
            label={
              <Typography variant="body2" color="text.secondary">
                I agree to the{" "}
                <Link
                  href="#"
                  sx={{ color: "#7CB9E8", textDecoration: "none", fontWeight: 600 }}
                >
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="#"
                  sx={{ color: "#7CB9E8", textDecoration: "none", fontWeight: 600 }}
                >
                  Privacy Policy
                </Link>
              </Typography>
            }
            sx={{ mt: 1 }}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              py: 1.8,
              background: "linear-gradient(135deg, #7CB9E8 0%, #A8D8EA 100%)",
              borderRadius: 3,
              fontWeight: 700,
              fontSize: "1rem",
              textTransform: "none",
              boxShadow: "0 4px 15px rgba(124, 185, 232, 0.4)",
            }}
            className="register-btn"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>

          <Typography variant="body2" textAlign="center" sx={{ mt: 3, color: "#666" }}>
            Already have an account?{" "}
            <span
              style={{ color: "#7CB9E8", cursor: "pointer", fontWeight: 700 }}
              onClick={() => (window.location.href = "/login")}
            >
              Login here
            </span>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}