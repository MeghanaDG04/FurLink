const Admin = require("../Models/AdminModel");
const jwt = require("jsonwebtoken");

// Create Admin (POST)
const createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if admin already exists
    const existingAdmin = await Admin.findOne();

    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }
    const admin = new Admin({
      email,
      password
    });
    await admin.save();
    res.status(201).json({
      message: "Admin created successfully",
      admin
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Login Admin
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    if (admin.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: admin._id },
      "secretkey",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        email: admin.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get Admin
const getAdmin = async (req, res) => {
  try {

    const admin = await Admin.findById(req.params.id).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json(admin);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createAdmin, adminLogin, getAdmin };