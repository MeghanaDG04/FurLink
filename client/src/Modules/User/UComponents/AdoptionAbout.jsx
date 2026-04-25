import React, { useState, useEffect } from "react";
import {
  Container, Typography, Box, Grid, Paper, Button, Card, CardContent,
  Avatar, Divider, Link, Fade, Zoom
} from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SearchIcon from "@mui/icons-material/Search";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import SecurityIcon from "@mui/icons-material/Security";
import SparklesIcon from "@mui/icons-material/AutoAwesome";
import { useNavigate } from "react-router-dom";

const AdoptionAbout = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    {
      icon: <SearchIcon sx={{ fontSize: 52, color: "#fff" }} />,
      title: "Browse Pets",
      description: "Explore our verified pets with detailed profiles. Filter by breed, age, and temperament to find your perfect companion.",
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      icon: <HowToRegIcon sx={{ fontSize: 52, color: "#fff" }} />,
      title: "Submit Application",
      description: "Fill out a simple adoption form. Our team carefully reviews each application to ensure the best match for both you and the pet.",
      color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      icon: <CheckCircleIcon sx={{ fontSize: 52, color: "#fff" }} />,
      title: "Get Approved",
      description: "Receive a response within 24-48 hours. Our thorough yet compassionate process ensures pets go to safe, loving homes.",
      color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    },
    {
      icon: <FavoriteIcon sx={{ fontSize: 52, color: "#fff" }} />,
      title: "Welcome Home",
      description: "Complete paperwork, meet your new family member, and take them home. We provide ongoing support for a smooth transition.",
      color: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
    }
  ];

  const benefits = [
    {
      icon: <PetsIcon sx={{ fontSize: 44, color: "#7CB9E8" }} />,
      title: "Save a Life",
      description: "Give a deserving pet a second chance at happiness and transform their world forever.",
      gradient: "linear-gradient(135deg, #FFE5E5 0%, #FFD1D1 100%)"
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 44, color: "#7CB9E8" }} />,
      title: "Health Guarantee",
      description: "All pets are vet-checked, vaccinated, and microchipped before joining their new family.",
      gradient: "linear-gradient(135deg, #E5F3FF 0%, #D1EDFF 100%)"
    },
    {
      icon: <VerifiedIcon sx={{ fontSize: 44, color: "#7CB9E8" }} />,
      title: "Verified Profiles",
      description: "Each pet's temperament, history, and needs are thoroughly verified for transparency.",
      gradient: "linear-gradient(135deg, #FFF3E5 0%, #FFE8D1 100%)"
    },
    {
      icon: <LocalHospitalIcon sx={{ fontSize: 44, color: "#7CB9E8" }} />,
      title: "Lifetime Support",
      description: "We offer guidance, resources, and a community of adopters to support you and your pet.",
      gradient: "linear-gradient(135deg, #E8FFE5 0%, #D1FFD1 100%)"
    }
  ];

  const trustFeatures = [
    "Thorough behavioral assessment",
    "Complete medical records",
    "Post-adoption follow-ups",
    "Experienced counselor support",
    "Transparent pet history",
    "30-day health guarantee"
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #F8FAFC 0%, #E8F4F8 50%, #F0F9FF 100%)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Decorative background elements */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.4,
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(124,185,232,0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(168,216,234,0.2) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)
          `,
          pointerEvents: "none"
        }}
      />

      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          py: { xs: 10, md: 16 },
          background: "linear-gradient(135deg, rgba(124,185,232,0.08) 0%, rgba(168,216,234,0.12) 50%, rgba(232,244,255,0.15) 100%)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(124,185,232,0.1)"
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box sx={{ mb: 4 }}>
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 1,
                      background: "linear-gradient(135deg, rgba(124,185,232,0.2) 0%, rgba(168,216,234,0.25) 100%)",
                      border: "1px solid rgba(124,185,232,0.3)",
                      borderRadius: 3,
                      px: 3,
                      py: 1,
                      mb: 4
                    }}
                  >
                    <SparklesIcon sx={{ fontSize: 20, color: "#7CB9E8" }} />
                    <Typography variant="body2" fontWeight={600} color="#7CB9E8" letterSpacing={2}>
                      TRUSTED ADOPTION PLATFORM
                    </Typography>
                  </Box>
                  <Typography
                    variant="h1"
                    fontWeight={900}
                    color="#1E293B"
                    sx={{
                      fontSize: { xs: "2.8rem", md: "4rem" },
                      lineHeight: 1.15,
                      mb: 3,
                      background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      textShadow: "0 2px 20px rgba(124,185,232,0.15)"
                    }}
                  >
                    Find Your Soulmate <br />
                    <Box component="span" sx={{
                      background: "linear-gradient(135deg, #7CB9E8 0%, #A8D8EA 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent"
                    }}>
                      in a Paw
                    </Box>
                  </Typography>
                  <Typography
                    variant="h5"
                    color="text.secondary"
                    sx={{
                      maxWidth: 540,
                      fontSize: { xs: "1.2rem", md: "1.35rem" },
                      lineHeight: 1.7,
                      mb: 5,
                      fontWeight: 400
                    }}
                  >
                    Every wag, purr, and wagging tail tells a story waiting to be continued.
                    Give a pet the forever home they deserve and gain a loyal companion for life.
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2.5 }}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<PetsIcon />}
                      onClick={() => navigate("/adopt/browse")}
                      sx={{
                        py: 2,
                        px: 5,
                        borderRadius: 4,
                        background: "linear-gradient(135deg, #7CB9E8 0%, #5BA8D8 100%)",
                        fontSize: "1.15rem",
                        fontWeight: 700,
                        boxShadow: "0 12px 32px rgba(124,185,232,0.45)",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          background: "linear-gradient(135deg, #5BA8D8 0%, #4A90C0 100%)",
                          transform: "translateY(-4px) scale(1.02)",
                          boxShadow: "0 20px 48px rgba(124,185,232,0.55)"
                        }
                      }}
                    >
                      Explore Available Pets
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      sx={{
                        py: 2,
                        px: 5,
                        borderRadius: 4,
                        borderWidth: 2,
                        borderColor: "rgba(124,185,232,0.5)",
                        color: "#334155",
                        fontSize: "1.15rem",
                        fontWeight: 600,
                        background: "rgba(255,255,255,0.7)",
                        backdropFilter: "blur(10px)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          borderColor: "#7CB9E8",
                          background: "rgba(255,255,255,0.95)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 24px rgba(124,185,232,0.25)"
                        }
                      }}
                    >
                      Learn About Process
                    </Button>
                  </Box>

                  {/* Trust badges */}
                  <Box sx={{ display: "flex", gap: 4, mt: 5, flexWrap: "wrap" }}>
                    {["500+ Pets Adopted", "100% Verified", "24hr Response"].map((badge, i) => (
                      <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "#7CB9E8"
                        }} />
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                          {badge}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
              <Zoom in timeout={1500}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    height: { xs: 300, md: 500 }
                  }}
                >
                  {/* Floating decorative elements */}
                  <Box
                    sx={{
                      position: "absolute",
                      width: 200,
                      height: 200,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, rgba(255,182,193,0.4) 0%, rgba(255,105,180,0.3) 100%)",
                      top: 20,
                      right: 40,
                      animation: "float 6s ease-in-out infinite"
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      width: 150,
                      height: 150,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, rgba(124,185,232,0.5) 0%, rgba(168,216,234,0.4) 100%)",
                      bottom: 20,
                      left: 20,
                      animation: "float 8s ease-in-out infinite reverse"
                    }}
                  />
                  {/* Main illustration */}
                  <Box
                    sx={{
                      position: "relative",
                      width: 280,
                      height: 280,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #7CB9E8 0%, #A8D8EA 100%)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      boxShadow: "0 40px 100px rgba(124,185,232,0.4)",
                      zIndex: 2,
                      animation: "pulse 4s ease-in-out infinite"
                    }}
                  >
                    <PetsIcon sx={{ fontSize: 120, color: "#fff" }} />
                  </Box>
                  <Box
                    sx={{
                      position: "absolute",
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      background: "#FFE5E5",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      top: 0,
                      right: 0,
                      boxShadow: "0 10px 30px rgba(255,107,107,0.3)",
                      animation: "float 5s ease-in-out infinite"
                    }}
                  >
                    <FavoriteIcon sx={{ fontSize: 50, color: "#FF6B6B" }} />
                  </Box>
                </Box>
              </Zoom>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Mission Section */}
      <Box
        sx={{
          py: { xs: 10, md: 14 },
          background: "#fff",
          position: "relative",
          boxShadow: "0 -10px 40px rgba(124,185,232,0.08)"
        }}
      >
        <Container maxWidth="md">
          <Fade in timeout={800}>
            <Box sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  display: "inline-block",
                  background: "linear-gradient(135deg, #7CB9E8 0%, #A8D8EA 100%)",
                  borderRadius: 3,
                  px: 4,
                  py: 1,
                  mb: 4,
                  boxShadow: "0 8px 24px rgba(124,185,232,0.3)"
                }}
              >
                <Typography variant="overline" fontWeight={800} color="#fff" letterSpacing={2}>
                  OUR MISSION
                </Typography>
              </Box>
              <Typography
                variant="h2"
                fontWeight={800}
                color="#1E293B"
                sx={{
                  fontSize: { xs: "2rem", md: "2.75rem" },
                  mb: 4,
                  lineHeight: 1.3
                }}
              >
                Connecting Hearts, <br />
                <Box component="span" sx={{ color: "#7CB9E8" }}>
                  Transforming Lives
                </Box>
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{
                  fontSize: { xs: "1.1rem", md: "1.25rem" },
                  lineHeight: 1.9,
                  maxWidth: 700,
                  mx: "auto"
                }}
              >
                We believe every pet deserves a loving home and every family deserves the joy
                of a companion. Our platform bridges that gap with compassion, transparency,
                and unwavering commitment to animal welfare.
              </Typography>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* How Adoption Works - Horizontal Stepper */}
      <Box
        sx={{
          py: { xs: 12, md: 16 },
          background: "linear-gradient(180deg, #F0F9FF 0%, #F8FAFC 100%)",
          position: "relative"
        }}
      >
        <Container maxWidth="xl">
          <Fade in timeout={1000}>
            <Box sx={{ textAlign: "center", mb: 10 }}>
              <Typography
                variant="h2"
                fontWeight={800}
                color="#1E293B"
                sx={{
                  fontSize: { xs: "1.75rem", md: "2rem" },
                  mb: 2
                }}
              >
                How Adoption Works
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: "auto", fontSize: { xs: "0.95rem", md: "1rem" } }}>
                Your journey to finding a perfect companion in four simple steps
              </Typography>
            </Box>
          </Fade>

          <Box
            sx={{
              overflowX: { xs: "auto", md: "visible" },
              mx: { xs: -2, md: 0 },
              px: { xs: 2, md: 0 },
              "&::-webkit-scrollbar": { display: "none" }
            }}
          >
            <Grid container spacing={0}>
              {steps.map((step, index) => (
                <Grid item xs={3} key={index}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      position: "relative",
                      cursor: "pointer",
                      transition: "all 0.4s ease",
                      p: { xs: 2, md: 3 },
                      borderRadius: 3,
                      mx: { xs: 0.5, md: 1 },
                      "&:hover": {
                        transform: "translateY(-8px)",
                        background: "rgba(124,185,232,0.04)"
                      }
                    }}
                    onClick={() => setActiveStep(index)}
                  >
                    {/* Step number badge */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: { xs: -12, md: -16 },
                        width: { xs: 24, md: 28 },
                        height: { xs: 24, md: 28 },
                        borderRadius: "50%",
                        background: activeStep >= index ? "linear-gradient(135deg, #7CB9E8 0%, #A8D8EA 100%)" : "#E2E8F0",
                        color: activeStep >= index ? "#fff" : "#94A3B8",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: { xs: "0.75rem", md: "0.85rem" },
                        boxShadow: activeStep === index ? "0 4px 12px rgba(124,185,232,0.4)" : "none",
                        transition: "all 0.3s ease",
                        zIndex: 3
                      }}
                    >
                      {index + 1}
                    </Box>

                    {/* Icon circle */}
                    <Box
                      sx={{
                        width: { xs: 70, md: 90 },
                        height: { xs: 70, md: 90 },
                        borderRadius: "50%",
                        background: step.color,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        mb: { xs: 1.5, md: 2 },
                        boxShadow: activeStep === index
                          ? "0 12px 32px rgba(124,185,232,0.3)"
                          : "0 4px 16px rgba(0,0,0,0.08)",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        border: activeStep === index ? "3px solid rgba(255,255,255,0.9)" : "2px solid rgba(255,255,255,0.6)"
                      }}
                    >
                      {React.cloneElement(step.icon, { sx: { fontSize: { xs: 28, md: 36 } } })}
                    </Box>

                    {/* Title and description */}
                    <Typography
                      variant="h6"
                      fontWeight={800}
                      color="#1E293B"
                      sx={{
                        mb: { xs: 0.5, md: 1 },
                        fontSize: { xs: "0.9rem", md: "1rem" },
                        lineHeight: 1.2
                      }}
                    >
                      {step.title.split(' ').map((word, i) => (
                        <Box component="span" key={i} sx={{ display: "block" }}>
                          {word}
                        </Box>
                      ))}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.5,
                        fontSize: { xs: "0.7rem", md: "0.8rem" },
                        maxWidth: { xs: 120, md: 150 }
                      }}
                    >
                      {step.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Why Adopt Section */}
      <Box
        sx={{
          py: { xs: 12, md: 18 },
          background: "#fff",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <Container maxWidth="lg">
          <Fade in timeout={1000}>
            <Box sx={{ textAlign: "center", mb: 10 }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1.5,
                  background: "linear-gradient(135deg, rgba(124,185,232,0.15) 0%, rgba(168,216,234,0.2) 100%)",
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  mb: 3
                }}
              >
                <FavoriteIcon sx={{ fontSize: 24, color: "#FF6B6B" }} />
                <Typography variant="h6" fontWeight={700} color="#1E293B" letterSpacing={0.5}>
                  WHY CHOOSE ADOPTION?
                </Typography>
              </Box>
              <Typography
                variant="h2"
                fontWeight={800}
                color="#1E293B"
                sx={{
                  fontSize: { xs: "2rem", md: "3rem" },
                  mb: 3
                }}
              >
                More Than Just a Pet,<br />
                <Box component="span" sx={{ color: "#7CB9E8" }}>
                  It&apos;s Family
                </Box>
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 650, mx: "auto", lineHeight: 1.7 }}>
                Discover the profound impact of adoption — for both you and the pet you'll rescue.
              </Typography>
            </Box>
          </Fade>

          <Grid container spacing={{ xs: 3, md: 4 }}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Fade in timeout={1200 + index * 150}>
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 5,
                      background: benefit.gradient,
                      boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      transform: "translateY(0)",
                      "&:hover": {
                        transform: "translateY(-16px) scale(1.02)",
                        boxShadow: "0 24px 64px rgba(124,185,232,0.25)"
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4, textAlign: "center" }}>
                      <Avatar
                        sx={{
                          width: 90,
                          height: 90,
                          mx: "auto",
                          mb: 3,
                          background: "rgba(255,255,255,0.9)",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.1)"
                        }}
                      >
                        {React.cloneElement(benefit.icon, { sx: { fontSize: 44 } })}
                      </Avatar>
                      <Typography
                        variant="h5"
                        fontWeight={800}
                        color="#1E293B"
                        sx={{
                          mb: 2,
                          fontSize: { xs: "1.25rem", md: "1.5rem" }
                        }}
                      >
                        {benefit.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                          lineHeight: 1.8,
                          fontSize: { xs: "0.95rem", md: "1rem" },
                          fontWeight: 500
                        }}
                      >
                        {benefit.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Trust & Transparency Section */}
      <Box
        sx={{
          py: { xs: 14, md: 20 },
          background: "linear-gradient(135deg, #1E293B 0%, #334155 60%, #475569 100%)",
          position: "relative",
          overflow: "hidden",
          color: "#fff"
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box>
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 1.5,
                      background: "rgba(124,185,232,0.15)",
                      border: "1px solid rgba(124,185,232,0.3)",
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      mb: 4
                    }}
                  >
                    <VerifiedIcon sx={{ fontSize: 24, color: "#7CB9E8" }} />
                    <Typography variant="body2" fontWeight={700} color="#7CB9E8" letterSpacing={1.5}>
                      TRUST & TRANSPARENCY
                    </Typography>
                  </Box>
                  <Typography
                    variant="h2"
                    fontWeight={800}
                    sx={{
                      fontSize: { xs: "2.5rem", md: "3.5rem" },
                      lineHeight: 1.15,
                      mb: 4
                    }}
                  >
                    Your Peace of Mind <br />
                    <Box component="span" sx={{ color: "#7CB9E8" }}>
                      Is Our Promise
                    </Box>
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "rgba(255,255,255,0.85)",
                      lineHeight: 1.8,
                      mb: 5,
                      fontSize: { xs: "1.1rem", md: "1.25rem" },
                      fontWeight: 400
                    }}
                  >
                    Every adoption is backed by rigorous verification, comprehensive health
                    checks, and our commitment to your satisfaction. We don't just connect
                    pets with people — we build lifelong relationships built on trust.
                  </Typography>

                  {/* Trust features grid */}
                  <Grid container spacing={3}>
                    {trustFeatures.map((feature, i) => (
                      <Grid item xs={6} key={i}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: "50%",
                              background: "linear-gradient(135deg, #7CB9E8 0%, #A8D8EA 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            <CheckCircleIcon sx={{ fontSize: 16, color: "#fff" }} />
                          </Box>
                          <Typography variant="body1" fontWeight={500}>
                            {feature}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
              <Fade in timeout={1500}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative"
                  }}
                >
                  <Avatar
                    sx={{
                      width: 280,
                      height: 280,
                      background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)",
                      backdropFilter: "blur(20px)",
                      border: "3px solid rgba(255,255,255,0.2)",
                      boxShadow: "0 30px 100px rgba(0,0,0,0.3)",
                      fontSize: "8rem"
                    }}
                  >
                    <SecurityIcon sx={{ fontSize: 120, color: "#7CB9E8" }} />
                  </Avatar>
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Final CTA */}
      <Box
        sx={{
          py: { xs: 14, md: 20 },
          background: "linear-gradient(180deg, #fff 0%, #F8FAFC 100%)",
          position: "relative"
        }}
      >
        <Container maxWidth="md">
          <Fade in timeout={2000}>
            <Box
              sx={{
                textAlign: "center",
                p: { xs: 5, md: 8 },
                borderRadius: 6,
                background: "linear-gradient(135deg, #7CB9E8 0%, #A8D8EA 100%)",
                boxShadow: "0 30px 100px rgba(124,185,232,0.4)",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: -100,
                  right: -100,
                  bottom: 0,
                  background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
                  animation: "shimmer 3s ease-in-out infinite"
                }
              }}
            >
              <Typography
                variant="h2"
                fontWeight={900}
                color="#fff"
                sx={{
                  fontSize: { xs: "2.2rem", md: "3rem" },
                  mb: 3,
                  lineHeight: 1.2,
                  position: "relative",
                  zIndex: 2
                }}
              >
                Ready to Open Your <br />
                Heart & Home?
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: "rgba(255,255,255,0.95)",
                  mb: 5,
                  maxWidth: 550,
                  mx: "auto",
                  lineHeight: 1.6,
                  position: "relative",
                  zIndex: 2
                }}
              >
                Every pet waiting for adoption has a story of hope.
                Be the happy ending they're searching for.
              </Typography>
              <Box sx={{ position: "relative", zIndex: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<PetsIcon />}
                  onClick={() => navigate("/adopt/browse")}
                  sx={{
                    py: 2.5,
                    px: 6,
                    borderRadius: 4,
                    background: "#fff",
                    color: "#7CB9E8",
                    fontSize: "1.2rem",
                    fontWeight: 800,
                    boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      background: "#F8FAFC",
                      transform: "translateY(-4px) scale(1.05)",
                      boxShadow: "0 20px 56px rgba(0,0,0,0.3)"
                    }
                  }}
                >
                  Start Your Adoption Journey
                </Button>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 6,
          background: "#0F172A",
          borderTop: "4px solid #7CB9E8"
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={5}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2.5 }}>
                <Avatar
                  sx={{
                    mr: 2,
                    width: 48,
                    height: 48,
                    background: "linear-gradient(135deg, #7CB9E8 0%, #A8D8EA 100%)"
                  }}
                >
                  <PetsIcon sx={{ fontSize: 28, color: "#fff" }} />
                </Avatar>
                <Typography variant="h6" fontWeight={800} color="#fff" letterSpacing={0.5}>
                  FurLink Adoption
                </Typography>
              </Box>
              <Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ lineHeight: 1.8, maxWidth: 320 }}>
                Connecting loving families with pets in need since 2020.
                Every adoption saves a life and creates a forever bond.
              </Typography>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="subtitle2" fontWeight={700} color="#fff" sx={{ mb: 3, letterSpacing: 1 }}>
                ADOPTION
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Link
                  href="/adopt/browse"
                  sx={{
                    color: "rgba(255,255,255,0.6)",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    transition: "color 0.2s",
                    "&:hover": { color: "#7CB9E8" }
                  }}
                >
                  Browse Pets
                </Link>
                <Link
                  href="/adopt/about"
                  sx={{
                    color: "rgba(255,255,255,0.6)",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    transition: "color 0.2s",
                    "&:hover": { color: "#7CB9E8" }
                  }}
                >
                  How It Works
                </Link>
                <Link
                  href="/adopt/my-adoptions"
                  sx={{
                    color: "rgba(255,255,255,0.6)",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    transition: "color 0.2s",
                    "&:hover": { color: "#7CB9E8" }
                  }}
                >
                  My Applications
                </Link>
              </Box>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="subtitle2" fontWeight={700} color="#fff" sx={{ mb: 3, letterSpacing: 1 }}>
                SUPPORT
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Link
                  href="/adopt/about"
                  sx={{
                    color: "rgba(255,255,255,0.6)",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    transition: "color 0.2s",
                    "&:hover": { color: "#7CB9E8" }
                  }}
                >
                  FAQs
                </Link>
                <Link
                  href="/adopt/about"
                  sx={{
                    color: "rgba(255,255,255,0.6)",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    transition: "color 0.2s",
                    "&:hover": { color: "#7CB9E8" }
                  }}
                >
                  Contact Us
                </Link>
                <Link
                  href="/adopt/about"
                  sx={{
                    color: "rgba(255,255,255,0.6)",
                    textDecoration: "none",
                    fontSize: "0.95rem",
                    transition: "color 0.2s",
                    "&:hover": { color: "#7CB9E8" }
                  }}
                >
                  Resources
                </Link>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" fontWeight={700} color="#fff" sx={{ mb: 3, letterSpacing: 1 }}>
                CONNECT
              </Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.6)" sx={{ lineHeight: 1.8 }}>
                Have questions? Our adoption counselors are here to help.
                Reach out and let us guide you on this beautiful journey.
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 5, borderColor: "rgba(255,255,255,0.1)" }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2
            }}
          >
            <Typography variant="body2" color="rgba(255,255,255,0.5)" fontWeight={500}>
              © 2024 FurLink Adoption. Made with ❤️ for pets everywhere.
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.5)" sx={{ fontStyle: "italic" }}>
              Every adoption tells a story of love.
            </Typography>
          </Box>
        </Container>

        {/* CSS Animations */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "none",
            "& @keyframes float": {
              "0%, 100%": { transform: "translateY(0px)" },
              "50%": { transform: "translateY(-20px)" }
            },
            "& @keyframes pulse": {
              "0%, 100%": { transform: "scale(1)" },
              "50%": { transform: "scale(1.05)" }
            },
            "& @keyframes shimmer": {
              "0%": { transform: "translateX(-100%)" },
              "100%": { transform: "translateX(100%)" }
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default AdoptionAbout;
