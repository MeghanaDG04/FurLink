import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar, Box, Toolbar, IconButton, Typography, Container,
  Avatar, Button, Drawer, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Divider,
  Tooltip
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Pets from "@mui/icons-material/Pets";
import HomeIcon from "@mui/icons-material/Home";
import ListAltIcon from "@mui/icons-material/ListAlt";
import InfoIcon from "@mui/icons-material/Info";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const adoptionPages = [
  { name: "Browse Pets", path: "/adopt/browse", icon: <Pets /> },
  { name: "My Adoptions", path: "/adopt/my-adoptions", icon: <ListAltIcon /> },
  { name: "About Adoption", path: "/adopt/about", icon: <InfoIcon /> },
];

const AdoptionNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          background: "linear-gradient(135deg, rgba(62, 151, 220, 0.95) 0%, rgba(70, 191, 236, 0.95) 100%)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          borderBottom: "2px solid rgba(255,255,255,0.3)",
          transition: "all 0.3s ease",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 56, md: 64 }, py: 0.5 }}>
            
            {/* Mobile menu */}
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{ 
                display: { xs: "flex", md: "none" }, 
                mr: 1,
                color: "#fff",
              }}
            >
              <MenuIcon />
            </IconButton>

            {/* Back to Main Site */}
            <Tooltip title="Back to Main Site">
              <IconButton
                onClick={() => navigate("/homepage")}
                sx={{ 
                  mr: 1,
                  color: "#fff",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.2)" }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>

            {/* Logo */}
            <Box
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                cursor: "pointer", 
                mr: { xs: 1, md: 4 },
              }}
              onClick={() => navigate("/adopt/browse")}
            >
              <Avatar
                sx={{
                  mr: 1,
                  width: { xs: 32, md: 38 },
                  height: { xs: 32, md: 38 },
                  background: "linear-gradient(135deg, #fff 0%, #f0f0f0 100%)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
              >
              <Pets sx={{ fontSize: { xs: 18, md: 22 }, color: "#7CB9E8" }} />
              </Avatar>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontWeight: 800,
                  letterSpacing: ".05rem",
                  color: "#fff",
                  fontSize: { xs: "1rem", md: "1.25rem" },
                  textShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }}
              >
                FurLink Adoption
              </Typography>
            </Box>

            {/* Desktop nav */}
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, gap: 0.5, ml: 1 }}>
              {adoptionPages.map((page) => (
                <Button
                  key={page.name}
                  startIcon={page.icon}
                  sx={{
                    px: 2,
                    py: 0.75,
                    color: isActive(page.path) ? "#7CB9E8" : "#fff",
                    fontWeight: isActive(page.path) ? 700 : 500,
                    bgcolor: isActive(page.path) ? "rgba(255,255,255,0.95)" : "transparent",
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "0.875rem",
                    transition: "all 0.2s ease",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.9)", color: "#7CB9E8" },
                  }}
                  onClick={() => navigate(page.path)}
                >
                  {page.name}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: { xs: 1, md: 0 } }} />

            {/* Back to Main Site Button (Desktop) */}
            <Button
              startIcon={<HomeIcon />}
              sx={{
                display: { xs: "none", md: "flex" },
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.5)",
                borderRadius: 2,
                px: 2,
                py: 0.5,
                fontSize: "0.8rem",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
              }}
              onClick={() => navigate("/homepage")}
            >
              Back to Store
            </Button>

          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 280, background: "linear-gradient(180deg, #7CB9E8 0%, #A8D8EA 100%)" } }}
      >
        <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.3)" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar sx={{ mr: 1.5, background: "#fff" }}>
              <Pets sx={{ color: "#7CB9E8" }} />
            </Avatar>
            <Typography variant="h6" fontWeight={700} sx={{ color: "#fff" }}>
              FurLink Adoption
            </Typography>
          </Box>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: "#fff" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.3)" }} />

        <List sx={{ px: 1, py: 2 }}>
          {adoptionPages.map((page) => (
            <ListItem key={page.name} disablePadding>
              <ListItemButton
                onClick={() => { navigate(page.path); setDrawerOpen(false); }}
                sx={{ 
                  borderRadius: 2, 
                  mb: 0.5,
                  bgcolor: isActive(page.path) ? "rgba(255,255,255,0.9)" : "transparent",
                  color: isActive(page.path) ? "#7CB9E8" : "#fff",
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                  {page.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={page.name} 
                  primaryTypographyProps={{ fontWeight: isActive(page.path) ? 700 : 500 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.3)" }} />

        <List sx={{ px: 1, py: 2 }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => { navigate("/homepage"); setDrawerOpen(false); }}
              sx={{ borderRadius: 2, mb: 0.5, color: "#fff" }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "#fff" }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Back to Main Site" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}

export default AdoptionNavbar;
