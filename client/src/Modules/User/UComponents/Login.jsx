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
} from "@mui/material";
import LockOutlined from "@mui/icons-material/LockOutlined";
import EmailOutlined from "@mui/icons-material/EmailOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Pets from "@mui/icons-material/Pets";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";
import axios from "axios";

const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .login-btn:hover {
    background: linear-gradient(135deg, #FF8C42 0%, #FFA030 100%) !important;
    box-shadow: 0 6px 20px rgba(255,154,86,0.5) !important;
    transform: translateY(-2px);
  }
  .forgot-link:hover {
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

const Mascot = ({ state }) => {
  return (
    <Box
      sx={{
        position: "absolute",
        right: -60,
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
          background: "linear-gradient(135deg, #FF9A56, #FFB347)",
          borderRadius: "50% 50% 45% 45%",
          position: "relative",
          boxShadow: "0 4px 15px rgba(255,154,86,0.4)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 20,
            left: 18,
            width: 12,
            height: 14,
            background: "#fff",
            borderRadius: "50%",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 20,
            right: 18,
            width: 12,
            height: 14,
            background: "#fff",
            borderRadius: "50%",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 31,
            left: 28,
            width: 8,
            height: 8,
            background: "#333",
            borderRadius: "50%",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 31,
            right: 28,
            width: 8,
            height: 8,
            background: "#333",
            borderRadius: "50%",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 42,
            left: 32,
            width: 16,
            height: 10,
            background: "#FF6B6B",
            borderRadius: "0 0 50% 50%",
          }}
        />
        {state === "success" && (
          <Box
            sx={{
              position: "absolute",
              top: -15,
              right: 5,
              width: 20,
              height: 30,
              background: "transparent",
              borderLeft: "4px solid #FF9A56",
              borderRadius: "50%",
              transform: "rotate(-30deg)",
              animation: "wag 0.3s ease infinite alternate",
            }}
          />
        )}
      </Box>
      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          @keyframes celebrate {
            0%, 100% { transform: rotate(-10deg) scale(1.1); }
            50% { transform: rotate(10deg) scale(1.1); }
          }
          @keyframes wag {
            0% { transform: rotate(-30deg); }
            100% { transform: rotate(30deg); }
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
            background: "#FF9A56",
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
          background: "#FF9A56",
          left: 25,
          top: 42,
          animation: `bounceCenter 0.8s ease-in-out infinite`,
        }}
      />
    </Box>
    <Typography sx={{ mt: 3, color: "#FF9A56", fontWeight: 700, fontSize: "1.2rem" }}>
      Welcome to FurLink!
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
      <Typography sx={{ fontSize: "2rem", fontWeight: 800, color: "#FF9A56", animation: "fadeInScale 0.5s ease" }}>
        🎉 Welcome to FurLink!
      </Typography>
      <Typography sx={{ mt: 2, color: "#7CB9E8", fontSize: "1.1rem" }}>
        The Complete World for Pet Lovers
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

export default function Login() {
  const [formdata, setFormdata] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [mascotState, setMascotState] = useState("idle");

  const [validFields, setValidFields] = useState({
    email: false,
    password: false,
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

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormdata({ ...formdata, [name]: value });
    setErrorMsg("");

    if (name === "email") {
      setValidFields((prev) => ({ ...prev, email: validateEmail(value) }));
    }
    if (name === "password") {
      setValidFields((prev) => ({ ...prev, password: value.length >= 4 }));
    }
  };

  const handleFocus = (field) => {
    if (field === "password") setMascotState("typing");
  };

  const handleBlur = (field) => {
    if (field === "password") setMascotState("idle");
  };

  const handleLogin = async () => {
    if (!formdata.email || !formdata.password) {
      setErrorMsg("Please fill in all fields");
      setMascotState("idle");
      return;
    }

    if (!validateEmail(formdata.email)) {
      setErrorMsg("Please enter a valid email format");
      return;
    }

    try {
      setLoading(true);
      setMascotState("typing");
      const res = await axios.post("http://localhost:7000/user/loginuser", {
        email: formdata.email,
        password: formdata.password,
      });

      console.log("Login response:", res.data);
      console.log("Token received:", res.data.token);
      console.log("Token type:", typeof res.data.token);
      localStorage.setItem("Token", res.data.token);
      setMascotState("success");
      setShowSuccess(true);
    } catch (err) {
      const message = err.response?.data?.message || "";
      if (message.toLowerCase().includes("password")) {
        setErrorMsg("❌ Incorrect password, try again or reset password");
      } else if (message.toLowerCase().includes("email") || message.toLowerCase().includes("user")) {
        setErrorMsg("❌ User not found. Please check your email or register");
      } else {
        setErrorMsg("❌ Login failed. Please try again");
      }
      setMascotState("idle");
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return <SuccessAnimation onComplete={() => (window.location.href = "/homepage")} />;
  }

  const fieldSx = (isValid, fieldName) => ({
    "& .MuiOutlinedInput-root": {
      borderRadius: 3,
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#7CB9E8" },
      ...(isValid && validFields[fieldName] ? { "& fieldset": { borderColor: "#4CAF50" } } : {}),
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "#7CB9E8" },
  });

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
          <Mascot state={mascotState} />

          <Typography variant="h5" textAlign="center" fontWeight={700} color="#2D3748" mb={0.5}>
            Welcome Back!
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
            Sign in to continue your pet journey
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

          <TextField
            label="Email"
            name="email"
            fullWidth
            margin="normal"
            onChange={handleChange}
            value={formdata.email}
            sx={fieldSx(validFields.email, "email")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlined sx={{ color: "#FF9A56" }} />
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
            sx={fieldSx(validFields.password, "password")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined sx={{ color: "#FF9A56" }} />
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

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1, mb: 2 }}>
            <FormControlLabel
              control={<Checkbox sx={{ color: "#FF9A56" }} />}
              label={<Typography variant="body2" color="text.secondary">Remember me</Typography>}
            />
            <Typography
              variant="body2"
              sx={{ color: "#FF9A56", cursor: "pointer", fontWeight: 600 }}
              className="forgot-link"
              onClick={() => (window.location.href = "/forgotpassword")}
            >
              Forgot Password?
            </Typography>
          </Box>

          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 1,
              py: 1.8,
              background: "linear-gradient(135deg, #FF9A56 0%, #FFB347 100%)",
              borderRadius: 3,
              fontWeight: 700,
              fontSize: "1rem",
              textTransform: "none",
              boxShadow: "0 4px 15px rgba(255,154,86,0.4)",
            }}
            className="login-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Login"}
          </Button>

          <Typography variant="body2" textAlign="center" sx={{ mt: 3, color: "#666" }}>
            Don't have an account?{" "}
            <span style={{ color: "#FF9A56", cursor: "pointer", fontWeight: 700 }} onClick={() => (window.location.href = "/register")}>
              Register here
            </span>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}