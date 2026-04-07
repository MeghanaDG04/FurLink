import React, { useState, useEffect } from "react";
import { Box, Typography, Container, Grid, Paper, Button, Avatar } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import Pets from "@mui/icons-material/Pets";
import StarIcon from "@mui/icons-material/Star";
import GroupsIcon from "@mui/icons-material/Groups";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import ShoppingBag from "@mui/icons-material/ShoppingBag";

const aboutStyleSheet = document.createElement("style");
aboutStyleSheet.textContent = `
  .about-card:hover {
    transform: translateY(-4px) !important;
    box-shadow: 0 12px 40px rgba(124, 185, 232, 0.25) !important;
  }
  .cta-btn:hover {
    transform: scale(1.05) !important;
    box-shadow: 0 8px 30px rgba(255, 154, 86, 0.5) !important;
  }
  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.15);
  }
  .flip-card {
    perspective: 1000px;
  }
  .flip-card-inner {
    transition: transform 0.6s;
    transform-style: preserve-3d;
  }
  .flip-card:hover .flip-card-inner {
    transform: rotateY(180deg);
  }
  .flip-card-front, .flip-card-back {
    backface-visibility: hidden;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .flip-card-back {
    transform: rotateY(180deg);
  }
  .choice-card {
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  .choice-card:hover {
    transform: scale(1.08) rotateX(5deg);
    box-shadow: 0 20px 50px rgba(255, 154, 86, 0.35) !important;
    border-color: rgba(255, 154, 86, 0.6) !important;
  }
  .choice-card .hidden-content {
    max-height: 0;
    opacity: 0;
    overflow: hidden;
    transition: all 0.4s ease;
  }
  .choice-card:hover .hidden-content {
    max-height: 100px;
    opacity: 1;
    margin-top: 12px;
  }
  .choice-card .show-icon {
    transition: transform 0.4s ease;
  }
  .choice-card:hover .show-icon {
    transform: scale(1.3) rotate(10deg);
  }
  @keyframes pawTrail {
    0% { transform: translateX(-100px) rotate(0deg); opacity: 0; }
    10% { opacity: 0.6; }
    90% { opacity: 0.6; }
    100% { transform: translateX(100vw) rotate(360deg); opacity: 0; }
  }
  @keyframes wiggle {
    0%, 100% { transform: rotate(-5deg); }
    50% { transform: rotate(5deg); }
  }
  .floating-paw {
    animation: wiggle 3s ease-in-out infinite;
  }
`;
document.head.appendChild(aboutStyleSheet);

const PawPrint = ({ style, size = 60 }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" style={style}>
    <ellipse cx="30" cy="45" rx="15" ry="12" fill="rgba(255,255,255,0.2)" />
    <ellipse cx="12" cy="28" rx="7" ry="9" fill="rgba(255,255,255,0.15)" />
    <ellipse cx="30" cy="18" rx="7" ry="9" fill="rgba(255,255,255,0.15)" />
    <ellipse cx="48" cy="28" rx="7" ry="9" fill="rgba(255,255,255,0.15)" />
  </svg>
);

const PawPrintSmall = ({ style }) => (
  <svg width="30" height="30" viewBox="0 0 60 60" style={style}>
    <ellipse cx="30" cy="45" rx="15" ry="12" fill="rgba(255,255,255,0.3)" />
    <ellipse cx="12" cy="28" rx="7" ry="9" fill="rgba(255,255,255,0.25)" />
    <ellipse cx="30" cy="18" rx="7" ry="9" fill="rgba(255,255,255,0.25)" />
    <ellipse cx="48" cy="28" rx="7" ry="9" fill="rgba(255,255,255,0.25)" />
  </svg>
);

const AnimatedPawGroup = () => {
  const paws = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    top: `${15 + i * 15}%`,
    delay: i * 0.8,
  }));

  return (
    <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "hidden", pointerEvents: "none" }}>
      {paws.map((paw) => (
        <Box
          key={paw.id}
          sx={{
            position: "absolute",
            top: paw.top,
            left: 0,
            animation: `pawTrail 8s linear ${paw.delay}s infinite`,
            opacity: 0,
          }}
        >
          <PawPrintSmall />
        </Box>
      ))}
    </Box>
  );
};

const FloatingPetIcon = ({ emoji, delay, top, left }) => (
  <Box
    sx={{
      position: "absolute",
      top,
      left,
      fontSize: "2rem",
      animation: `float 4s ease-in-out ${delay}s infinite`,
      opacity: 0.4,
    }}
  >
    {emoji}
  </Box>
);

export default function About() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const pawElements = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 92}%`,
    top: `${Math.random() * 92}%`,
    size: 30 + Math.random() * 40,
    rotation: Math.random() * 360,
    delay: Math.random() * 3,
    speed: 4 + Math.random() * 4,
  }));

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <Box sx={{ overflowX: "hidden", background: "linear-gradient(180deg, #E8F4FD 0%, #FFF5EE 50%, #FFF9F0 100%)" }}>

      {/* HERO SECTION WITH ANIMATED BACKGROUND */}
      <Box
        sx={{
          position: "relative",
          minHeight: "65vh",
          overflow: "hidden",
          background: "linear-gradient(135deg, #7CB9E8 0%, #A8D8EA 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        {/* Animated Paw Trail */}
        <AnimatedPawGroup />

        {/* Floating Pet Emojis */}
        {["🐕", "🐈", "🐦", "🐠", "🐹", "🐰"].map((emoji, i) => (
          <FloatingPetIcon
            key={i}
            emoji={emoji}
            delay={i * 0.5}
            top={`${10 + (i * 15)}%`}
            left={i % 2 === 0 ? "5%" : "85%"}
          />
        ))}

        {/* Floating Paw Elements */}
        {pawElements.slice(0, 8).map((paw) => (
          <Box
            key={paw.id}
            sx={{
              position: "absolute",
              left: paw.left,
              top: paw.top,
              transform: `rotate(${paw.rotation}deg)`,
              opacity: 0.25,
              animation: `float ${paw.speed}s ease-in-out ${paw.delay}s infinite`,
            }}
          >
            <PawPrint size={paw.size} />
          </Box>
        ))}

        {/* Decorative Orbs */}
        <Box
          sx={{
            position: "absolute",
            top: "5%",
            left: "10%",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            animation: "float 8s infinite ease-in-out",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "10%",
            right: "5%",
            width: 250,
            height: 250,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            animation: "float 10s infinite ease-in-out 2s",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "40%",
            right: "20%",
            width: 150,
            height: 150,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            animation: "float 6s infinite ease-in-out 1s",
          }}
        />

        {/* Content */}
        <Box sx={{ position: "relative", zIndex: 2 }}>
          <Avatar
            sx={{
              mx: "auto",
              mb: 3,
              width: 100,
              height: 100,
              background: "rgba(255,255,255,0.2)",
              border: "4px solid rgba(255,255,255,0.5)",
            }}
          >
            <Pets sx={{ fontSize: 55, color: "#fff" }} />
          </Avatar>
          <Typography variant="h2" fontWeight="bold" sx={{ letterSpacing: 2, textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
            FurLink
          </Typography>
          <Typography variant="h5" mt={2} sx={{ color: "rgba(0, 0, 0, 0.9)", fontWeight: 500 }}>
            The Complete World for Pet Lovers
          </Typography>
          <Typography variant="body1" mt={1} sx={{ color: "rgba(0, 0, 0, 0.7)", maxWidth: 500, mx: "auto" }}>
            Connecting pets with loving families
          </Typography>
        </Box>

        <style>
          {`
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-25px); }
            }
          `}
        </style>
      </Box>

      {/* STATS SECTION */}
      <Container sx={{ mt: -5, position: "relative", zIndex: 2, mb: 6 }}>
        <Grid container spacing={3}>
          {[
            { icon: <GroupsIcon sx={{ fontSize: 36 }} />, value: "25K+", label: "Happy Pet Parents", gradient: "linear-gradient(135deg, #fb00ff 0%, #A8D8EA 100%)" },
            { icon: <Pets sx={{ fontSize: 36 }} />, value: "15K+", label: "Pets Adopted", gradient: "linear-gradient(135deg, #19fd2c 0%, #A8D8EA 100%)" },
            { icon: <StarIcon sx={{ fontSize: 36 }} />, value: "4.9★", label: "Average Rating", gradient: "linear-gradient(135deg, #e0ad05 0%, #A8D8EA 100%)" },
            { icon: <FavoriteIcon sx={{ fontSize: 36 }} />, value: "98%", label: "Happy Pets", gradient: "linear-gradient(135deg, #ff0000 0%, #FF8E8E 100%)" },
          ].map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Paper
                elevation={0}
                className="stat-card"
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: stat.gradient,
                  color: "#fff",
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Box sx={{ position: "absolute", top: -10, right: -10, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />
                {stat.icon}
                <Typography variant="h4" fontWeight={700} mt={1}>{stat.value}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>{stat.label}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ABOUT SECTION */}
      <Container sx={{ py: 6 }}>
        <Paper
          elevation={0}
          sx={{
            p: 5,
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.97)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(124, 185, 232, 0.15)",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" fontWeight={700} mb={2} color="#2D3748">
            What is FurLink? 🐾
          </Typography>
          <Typography variant="body1" color="text.secondary" maxWidth="700px" mx="auto" lineHeight={1.8}>
            FurLink is your one-stop destination for everything pet-related! We connect adorable pets with loving families through our adoption platform, 
            while also providing premium pet supplies, food, and accessories. Whether you're looking to adopt a new furry friend or need quality supplies for your 
            existing companion, FurLink is here to help. We believe every pet deserves a loving home, and every pet parent deserves the best for their beloved companions.
          </Typography>
        </Paper>
      </Container>

      {/* CHOOSE FURINK SECTION - Interactive Cards */}
      <Container maxWidth="lg" sx={{ py: 4, px: 4 }}>
        <Typography variant="h5" fontWeight={700} textAlign="center" mb={1} color="#2D3748">
          Why Choose FurLink? 🐶
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
          Hover over each card to discover the magic! ✨
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 2, mx: 2 }}>
          {[
            { emoji: "🏠", title: "Pet Adoption", gradient: "linear-gradient(135deg, #3b7cae 0%, #2c677c 100%)", hiddenDesc: "15,000+ pets waiting" },
            { emoji: "🛒", title: "Premium Supplies", gradient: "linear-gradient(135deg, #0492ff 0%, #2db5e6 100%)", hiddenDesc: "100+ trusted brands" },
            { emoji: "💬", title: "24/7 Support", gradient: "linear-gradient(135deg, #f14444 0%, #f35252 100%)", hiddenDesc: "Experts anytime" },
            { emoji: "🚚", title: "Fast Delivery", gradient: "linear-gradient(135deg, #4CAF50 0%, #57c55c 100%)", hiddenDesc: "Free above ₹499" },
            { emoji: "⭐", title: "Best Prices", gradient: "linear-gradient(135deg, #c0a509 0%, #e1cf2d 100%)", hiddenDesc: "Up to 50% off" },
            { emoji: "💝", title: "Happy Pets", gradient: "linear-gradient(135deg, #ed2669 0%, #e73c75 100%)", hiddenDesc: "98% happy parents" }
          ].map((item, index) => (
            <Box key={index} sx={{ flex: "1 1 150px", maxWidth: 180, minWidth: 140 }}>
              <Paper
                elevation={0}
                className="choice-card"
                sx={{
                  p: 2,
                  py: 3,
                  borderRadius: 2,
                  background: "rgba(255,255,255,0.97)",
                  border: "1px solid rgba(124,185,232,0.15)",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  height: "100%",
                  minHeight: 100,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                <Box className="show-icon" sx={{ fontSize: "1.8rem", mb: 0.5 }}>{item.emoji}</Box>
                <Typography variant="body2" fontWeight={700} color="#2D3748">
                  {item.title}
                </Typography>
                <Box className="hidden-content">
                  <Box sx={{ 
                    px: 1, 
                    py: 0.5, 
                    borderRadius: 1, 
                    background: item.gradient,
                    color: "#fff",
                  }}>
                    <Typography variant="caption" fontWeight={500}>
                      {item.hiddenDesc}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          ))}
        </Box>
      </Container>

      {/* QUOTE SECTION */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #7CB9E8 0%, #A8D8EA 100%)",
          color: "white",
          mt: 6,
          py: 8,
          textAlign: "center",
          px: 2,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Paw Prints in Background */}
        {pawElements.slice(0, 6).map((paw) => (
          <Box
            key={paw.id}
            sx={{
              position: "absolute",
              left: paw.left,
              top: paw.top,
              transform: `rotate(${paw.rotation}deg)`,
              opacity: 0.15,
            }}
          >
            <PawPrint size={paw.size * 0.7} />
          </Box>
        ))}

        {/* Pet Emoji Decorations */}
        <Box sx={{ position: "absolute", top: "15%", left: "8%", fontSize: "3rem", opacity: 0.2 }}>🐕</Box>
        <Box sx={{ position: "absolute", top: "20%", right: "10%", fontSize: "3rem", opacity: 0.2 }}>🐈</Box>
        <Box sx={{ position: "absolute", bottom: "15%", left: "15%", fontSize: "2.5rem", opacity: 0.2 }}>🐦</Box>
        <Box sx={{ position: "absolute", bottom: "20%", right: "12%", fontSize: "2.5rem", opacity: 0.2 }}>🐠</Box>

        <Typography variant="h4" fontWeight={600} sx={{ color: "#fff", textShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
          "Where love meets paws." 🐾
        </Typography>
        <Typography variant="body1" mt={2} sx={{ color: "rgba(255,255,255,0.8)" }}>
          Every pet deserves a loving home. Every home deserves a loyal companion.
        </Typography>
      </Box>

      {/* CALL TO ACTION */}
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5" fontWeight={700} color="#2D3748">
          Ready to Find Your New Best Friend? 🐕
        </Typography>
        <Typography variant="body1" color="text.secondary" mt={1}>
          Join thousands of happy pet parents in our FurLink family
        </Typography>
        <Button
          variant="contained"
          className="cta-btn"
          sx={{
            mt: 3,
            px: 5,
            py: 1.5,
            borderRadius: 3,
            fontWeight: 700,
            fontSize: "1rem",
            textTransform: "none",
background: "linear-gradient(135deg, #28d12d 0%, #aea8ea 100%)",
            boxShadow: "0 5px 20px rgba(124,185,232,0.4)",
          }}
          onClick={() => window.location.href = '/register'}
        >
          Get Started Now 🐾
        </Button>
      </Box>

      {/* FOOTER DECORATION */}
      <Box sx={{ textAlign: "center", pb: 4, opacity: 0.3 }}>
        <Typography variant="h2">🐕 🐈 🐦 🐠 🐹 🐰</Typography>
      </Box>
    </Box>
  );
}