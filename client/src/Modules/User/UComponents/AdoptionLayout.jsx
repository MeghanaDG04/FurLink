import React from "react";
import { Outlet } from "react-router-dom";
import AdoptionNavbar from "./AdoptionNavbar";
import { Box } from "@mui/material";

const AdoptionLayout = () => {
  return (
    <Box sx={{ minHeight: "100vh", background: "#F8FAFC" }}>
      <AdoptionNavbar />
      <Outlet />
    </Box>
  );
};

export default AdoptionLayout;
