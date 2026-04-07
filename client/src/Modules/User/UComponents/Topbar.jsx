import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar, Box, Toolbar, IconButton, Typography, Container,
  Avatar, Button, Tooltip, Badge, Drawer, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Divider, Menu, MenuItem,
  InputBase, alpha,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Pets from "@mui/icons-material/Pets";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AddBoxIcon from "@mui/icons-material/AddBox";

const topbarStyles = document.createElement("style");
topbarStyles.textContent = `
  .topbar-link:hover { transform: translateY(-2px); }
  .topbar-search { transition: all 0.3s ease; }
  .topbar-search:focus-within { box-shadow: 0 0 0 2px rgba(124,185,232,0.5); }
`;
document.head.appendChild(topbarStyles);

const pages = [
  { name: "Home", path: "/homepage", icon: <HomeIcon /> },
  { name: "About", path: "/about", icon: <InfoIcon /> },
  { name: "Adopt", path: "/adopt", icon: <Pets /> },
];

const Topbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotify, setAnchorElNotify] = useState(null);
  const [username, setUsername] = useState("User");
  const [scrolled, setScrolled] = useState(false);

  const token = localStorage.getItem("Token");
  console.log(token);

  const settings = token ? [
    { name: "Profile", path: "/myprofile", icon: <PersonIcon /> },
    { name: "Orders", path: "/orders", icon: <ShoppingCartIcon /> },
    { name: "Wishlist", path: "/wishlist", icon: <FavoriteIcon /> },
    { name: "Logout", path: "/login", icon: <LogoutIcon />, action: "logout" },
  ] : [
    { name: "Login", path: "/login", icon: <PersonIcon /> },
  ];

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleOpenNotifyMenu = (event) => setAnchorElNotify(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const handleCloseNotifyMenu = () => setAnchorElNotify(null);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getUserProfile = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:7000/user/getprofile", {
        method: "GET",
        headers: { "auth-token": token },
      });
      const data = await res.json();
      if (data.udata) setUsername(data.udata.name || "User");
    } catch (error) {
      console.log("Profile fetch error", error);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  const handleMenuItemClick = (setting) => {
    if (setting.action === "logout") {
      localStorage.removeItem("Token");
      navigate("/login");
    } else {
      navigate(setting.path);
    }
    handleCloseUserMenu();
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          background: scrolled 
            ? "rgba(255,255,255,0.98)" 
            : "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(232,244,253,0.9) 100%)",
          backdropFilter: "blur(10px)",
          boxShadow: scrolled 
            ? "0 4px 20px rgba(124,185,232,0.15)" 
            : "0 2px 10px rgba(0,0,0,0.08)",
          borderBottom: "1px solid rgba(124,185,232,0.15)",
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
                color: "#7CB9E8",
              }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo */}
            <Box
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                cursor: "pointer", 
                mr: { xs: 1, md: 4 },
              }}
              onClick={() => navigate("/homepage")}
            >
              <Avatar
                sx={{
                  mr: 1,
                  width: { xs: 32, md: 38 },
                  height: { xs: 32, md: 38 },
                  background: "linear-gradient(135deg, #7CB9E8 0%, #A8D8EA 100%)",
                  boxShadow: "0 2px 8px rgba(124,185,232,0.3)",
                }}
              >
                <Pets sx={{ fontSize: { xs: 18, md: 22 }, color: "#fff" }} />
              </Avatar>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontWeight: 800,
                  letterSpacing: ".05rem",
                  background: "linear-gradient(135deg, #7CB9E8, #FF9A56)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: { xs: "1rem", md: "1.25rem" },
                  display: { xs: "none", sm: "block" },
                }}
              >
                FurLink
              </Typography>
            </Box>

            {/* Search bar */}
            <Box
              className="topbar-search"
              sx={{
                position: "relative",
                borderRadius: 2,
                backgroundColor: (theme) => alpha(theme.palette.common.black, 0.04),
                border: "1px solid rgba(124,185,232,0.2)",
                "&:hover": { backgroundColor: (theme) => alpha(theme.palette.common.black, 0.06) },
                mr: 2,
                ml: 1,
                width: { xs: "auto", md: 250 },
                display: { xs: "none", md: "flex" },
              }}
            >
              <Box sx={{ p: 0, height: "100%", position: "absolute", pointerEvents: "none", display: "flex", alignItems: "center", pl: 1.5 }}>
                <SearchIcon sx={{ color: "#7CB9E8", fontSize: 20 }} />
              </Box>
              <InputBase
                placeholder="Search pets, products..."
                sx={{ pl: 5, pr: 2, py: 0.5, width: "100%", fontSize: "0.875rem" }}
              />
            </Box>

            {/* Desktop nav */}
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, gap: 0.5, ml: 1 }}>
              {pages.map((page) => (
                <Button
                  key={page.name}
                  startIcon={page.icon}
                  className="topbar-link"
                  sx={{
                    px: 2,
                    py: 0.75,
                    color: isActive(page.path) ? "#7CB9E8" : "rgba(0,0,0,0.7)",
                    fontWeight: isActive(page.path) ? 700 : 500,
                    bgcolor: isActive(page.path) ? "rgba(124,185,232,0.12)" : "transparent",
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "0.875rem",
                    transition: "all 0.2s ease",
                    "&:hover": { bgcolor: "rgba(124,185,232,0.1)", color: "#7CB9E8" },
                  }}
                  onClick={() => navigate(page.path)}
                >
                  {page.name}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: { xs: 1, md: 0 } }} />

            {/* Right actions */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>

              {/* Post Pet button */}
              {/* <Tooltip title="Post a pet">
                <Button
                  startIcon={<AddBoxIcon />}
                  sx={{
                    display: { xs: "none", sm: "flex" },
                    color: "#fff",
                    background: "linear-gradient(135deg, #7CB9E8 0%, #A8D8EA 100%)",
                    borderRadius: 2,
                    px: 2,
                    py: 0.5,
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    textTransform: "none",
                    "&:hover": { background: "linear-gradient(135deg, #5BA8D8 0%, #98C8E0 100%)" },
                  }}
                  onClick={() => navigate("/postpet")}
                >
                  Post Pet
                </Button>
              </Tooltip> */}

              <Tooltip title="Wishlist">
                <IconButton sx={{ color: "rgba(0,0,0,0.6)" }}>
                  <FavoriteIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Cart">
                <IconButton sx={{ color: "rgba(0,0,0,0.6)" }}>
                  <Badge badgeContent={0} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Tooltip title="Notifications">
                <IconButton onClick={handleOpenNotifyMenu} sx={{ color: "rgba(0,0,0,0.6)" }}>
                  <Badge badgeContent={2} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* Notifications Menu */}
              <Menu
                anchorEl={anchorElNotify}
                open={Boolean(anchorElNotify)}
                onClose={handleCloseNotifyMenu}
                PaperProps={{ sx: { width: 280, maxHeight: 300 } }}
              >
                <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                  <Typography variant="subtitle2" fontWeight={700} color="#7CB9E8">
                    Notifications
                  </Typography>
                </Box>
                <MenuItem onClick={handleCloseNotifyMenu}>
                  <ListItemIcon><FavoriteIcon sx={{ color: "#FF6B6B" }} /></ListItemIcon>
                  <ListItemText primary="New pet added to wishlist" secondary="Just now" />
                </MenuItem>
                <MenuItem onClick={handleCloseNotifyMenu}>
                  <ListItemIcon><Pets sx={{ color: "#7CB9E8" }} /></ListItemIcon>
                  <ListItemText primary="Pet adoption update" secondary="2 hours ago" />
                </MenuItem>
              </Menu>

              {/* USER AVATAR */}
              <Tooltip title="My Account">
                <IconButton onClick={handleOpenUserMenu}>
                  <Avatar
                    sx={{
                      width: { xs: 30, md: 34 },
                      height: { xs: 30, md: 34 },
                      background: "linear-gradient(135deg, #7CB9E8 0%, #A8D8EA 100%)",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                    }}
                  >
                    {username.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>

              {/* USER MENU */}
              <Menu
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                PaperProps={{ sx: { width: 220 } }}
              >
                <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                  <Typography variant="subtitle2" fontWeight={700} color="#333">
                    {username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Welcome back! 👋
                  </Typography>
                </Box>
                <Divider />
                {settings.map((setting) => (
                  <MenuItem
                    key={setting.name}
                    onClick={() => handleMenuItemClick(setting)}
                    sx={{ color: setting.name === "Logout" ? "#FF6B6B" : "inherit" }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: setting.name === "Logout" ? "#FF6B6B" : "#7CB9E8" }}>
                      {setting.icon}
                    </ListItemIcon>
                    <ListItemText primary={setting.name} />
                  </MenuItem>
                ))}
              </Menu>

            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 280 } }}
      >
        <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar sx={{ mr: 1.5, background: "linear-gradient(135deg, #7CB9E8, #A8D8EA)" }}>
              <Pets sx={{ color: "#fff" }} />
            </Avatar>
            <Typography variant="h6" fontWeight={700} sx={{ background: "linear-gradient(135deg, #7CB9E8, #FF9A56)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              FurLink
            </Typography>
          </Box>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        <List sx={{ px: 1, py: 2 }}>
          {pages.map((page) => (
            <ListItem key={page.name} disablePadding>
              <ListItemButton
                onClick={() => { navigate(page.path); setDrawerOpen(false); }}
                sx={{ 
                  borderRadius: 2, 
                  mb: 0.5,
                  bgcolor: isActive(page.path) ? "rgba(124,185,232,0.1)" : "transparent",
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: isActive(page.path) ? "#7CB9E8" : "#666" }}>
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

        <Divider />

        <List sx={{ px: 1, py: 2 }}>
          {settings.map((setting) => (
            <ListItem key={setting.name} disablePadding>
              <ListItemButton
                onClick={() => { handleMenuItemClick(setting); setDrawerOpen(false); }}
                sx={{ borderRadius: 2, mb: 0.5 }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: setting.name === "Logout" ? "#FF6B6B" : "#666" }}>
                  {setting.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={setting.name} 
                  primaryTypographyProps={{ color: setting.name === "Logout" ? "#FF6B6B" : "inherit" }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}

export default Topbar;