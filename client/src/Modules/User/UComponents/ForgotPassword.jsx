import React, { useState } from "react";
import {
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Avatar,
  InputAdornment,
  IconButton,
} from "@mui/material";
import LockOutlined from "@mui/icons-material/LockOutlined";
import EmailOutlined from "@mui/icons-material/EmailOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Pets from "@mui/icons-material/Pets";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";
import ArrowBack from "@mui/icons-material/ArrowBack";
import axios from "axios";

const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .verify-btn:hover {
    background: linear-gradient(135deg, #FF8C42 0%, #FFA030 100%) !important;
    box-shadow: 0 6px 20px rgba(255,154,86,0.5) !important;
    transform: translateY(-2px);
  }
  .reset-btn:hover {
    background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%) !important;
    box-shadow: 0 6px 20px rgba(76,175,80,0.5) !important;
    transform: translateY(-2px);
  }
  .back-btn:hover {
    text-decoration: underline;
  }
`;
document.head.appendChild(styleSheet);

const PawPrint = ({ style }) => (
  <svg width="50" height="50" viewBox="0 0 50 50" style={style}>
    <ellipse cx="25" cy="38" rx="12" ry="10" fill="rgba(255,255,255,0.2)" />
    <ellipse cx="10" cy="24" rx="6" ry="7" fill="rgba(255,255,255,0.15)" />
    <ellipse cx="25" cy="15" rx="6" ry="7" fill="rgba(255,255,255,0.15)" />
    <ellipse cx="40" cy="24" rx="6" ry="7" fill="rgba(255,255,255,0.15)" />
  </svg>
);

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    match: false,
  });

  const pawPrints = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 92}%`,
    top: `${Math.random() * 92}%`,
    rotation: Math.random() * 360,
    delay: Math.random() * 2,
  }));

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErrorMsg("");
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    setErrorMsg("");
    validatePassword(value, confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setErrorMsg("");
    validatePassword(newPassword, value);
  };

  const validatePassword = (password, confirm) => {
    setPasswordValidation({
      length: password.length >= 6,
      match: password === confirm && password.length > 0,
    });
  };

  const handleVerifyEmail = async () => {
    if (!email) {
      setErrorMsg("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMsg("Please enter a valid email format");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");
      const res = await axios.post("http://localhost:7000/user/verifyemail", {
        email: email,
      });

      if (res.data.success) {
        setUserId(res.data.userId);
        setStep(2);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setErrorMsg("Please fill in all fields");
      return;
    }

    if (!passwordValidation.length) {
      setErrorMsg("Password must be at least 6 characters");
      return;
    }

    if (!passwordValidation.match) {
      setErrorMsg("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");
      const res = await axios.post("http://localhost:7000/user/resetpassword", {
        userId: userId,
        newPassword: newPassword,
      });

      if (res.data.success) {
        setStep(3);
        setSuccessMsg(res.data.message);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    window.location.href = "/login";
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 3,
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#7CB9E8" },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "#7CB9E8" },
  };

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

      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.1); }
          }
        `}
      </style>

      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 450,
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
            background: "linear-gradient(135deg, #FF9A56 0%, #FFB347 100%)",
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
              left: -25,
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
          <Typography variant="h5" textAlign="center" fontWeight={700} color="#2D3748" mb={0.5}>
            Forgot Password
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
            {step === 1
              ? "Enter your registered email address to continue"
              : step === 2
              ? "Create a new password for your account"
              : "Password has been reset successfully"}
          </Typography>

          {errorMsg && (
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
                {errorMsg}
              </Typography>
            </Box>
          )}

          {successMsg && step === 3 && (
            <Box
              sx={{
                mb: 2,
                p: 1.5,
                bgcolor: "rgba(76,175,80,0.1)",
                borderRadius: 2,
                border: "1px solid rgba(76,175,80,0.3)",
              }}
            >
              <Typography color="#4CAF50" fontSize="14px" fontWeight={500}>
                {successMsg}
              </Typography>
            </Box>
          )}

          {step === 1 && (
            <>
              <TextField
                label="Email Address"
                name="email"
                fullWidth
                margin="normal"
                onChange={handleEmailChange}
                value={email}
                sx={fieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined sx={{ color: "#FF9A56" }} />
                    </InputAdornment>
                  ),
                  endAdornment: email && (
                    <InputAdornment position="end">
                      {validateEmail(email) ? (
                        <CheckCircle sx={{ color: "#4CAF50", fontSize: 20 }} />
                      ) : (
                        <Cancel sx={{ color: "#FF6B6B", fontSize: 20 }} />
                      )}
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 3,
                  py: 1.8,
                  background: "linear-gradient(135deg, #FF9A56 0%, #FFB347 100%)",
                  borderRadius: 3,
                  fontWeight: 700,
                  fontSize: "1rem",
                  textTransform: "none",
                  boxShadow: "0 4px 15px rgba(255,154,86,0.4)",
                }}
                className="verify-btn"
                onClick={handleVerifyEmail}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify Email"}
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <TextField
                label="New Password"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                onChange={handlePasswordChange}
                value={newPassword}
                sx={fieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined sx={{ color: "#FF9A56" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: "#7CB9E8" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                onChange={handleConfirmPasswordChange}
                value={confirmPassword}
                sx={fieldSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined sx={{ color: "#FF9A56" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        sx={{ color: "#7CB9E8" }}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ mt: 2, mb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                  {passwordValidation.length ? (
                    <CheckCircle sx={{ color: "#4CAF50", fontSize: 16, mr: 0.5 }} />
                  ) : (
                    <Cancel sx={{ color: "#FF6B6B", fontSize: 16, mr: 0.5 }} />
                  )}
                  <Typography variant="caption" color={passwordValidation.length ? "#4CAF50" : "#666"}>
                    At least 8 characters
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {passwordValidation.match ? (
                    <CheckCircle sx={{ color: "#4CAF50", fontSize: 16, mr: 0.5 }} />
                  ) : (
                    <Cancel sx={{ color: "#FF6B6B", fontSize: 16, mr: 0.5 }} />
                  )}
                  <Typography variant="caption" color={passwordValidation.match ? "#4CAF50" : "#666"}>
                    Passwords match
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  py: 1.8,
                  background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
                  borderRadius: 3,
                  fontWeight: 700,
                  fontSize: "1rem",
                  textTransform: "none",
                  boxShadow: "0 4px 15px rgba(76,175,80,0.4)",
                }}
                className="reset-btn"
                onClick={handleResetPassword}
                disabled={loading || !passwordValidation.length || !passwordValidation.match}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </>
          )}

          {step === 3 && (
            <Box sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  bgcolor: "rgba(76,175,80,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <CheckCircle sx={{ fontSize: 50, color: "#4CAF50" }} />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Please login with your new password
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  py: 1.8,
                  background: "linear-gradient(135deg, #FF9A56 0%, #FFB347 100%)",
                  borderRadius: 3,
                  fontWeight: 700,
                  fontSize: "1rem",
                  textTransform: "none",
                  boxShadow: "0 4px 15px rgba(255,154,86,0.4)",
                }}
                onClick={handleBackToLogin}
              >
                Back to Login
              </Button>
            </Box>
          )}

          {step < 3 && (
            <Typography
              variant="body2"
              textAlign="center"
              sx={{ mt: 3, color: "#666" }}
            >
              <span
                style={{
                  color: "#FF9A56",
                  cursor: "pointer",
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                }}
                onClick={handleBackToLogin}
              >
                <ArrowBack sx={{ fontSize: 18, mr: 0.5 }} />
                Back to Login
              </span>
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
}