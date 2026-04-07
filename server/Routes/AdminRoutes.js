const express = require("express");
const route = express.Router();

const { createAdmin, adminLogin, getAdmin } = require("../Controller/AdminController");

route.post("/create", createAdmin);
route.post("/login", adminLogin);
route.get("/:id", getAdmin);

module.exports = route;