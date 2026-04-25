const adoptTable = require("../Models/AdoptModel");
const Pet = require("../Models/PetModel");

// CREATE ADOPTION REQUEST (User)
const createAdoptRequest = async (req, res) => {
  try {
    const userId = req.userid; // from auth middleware
    const adoptData = req.body;
    
    // If petId is provided, verify pet exists and is available
    if (adoptData.petId) {
      const pet = await Pet.findById(adoptData.petId);
      if (!pet) {
        return res.status(404).json({ message: "Pet not found" });
      }
      if (pet.status !== 'Available') {
        return res.status(400).json({ message: "Pet is not available for adoption" });
      }
      // Update pet status to Pending
      await Pet.findByIdAndUpdate(adoptData.petId, { status: 'Pending' });
    }
    
    const newAdopt = new adoptTable({
      ...adoptData,
      userId
    });
    await newAdopt.save();
    res.status(201).json({
      message: "Adoption request submitted successfully",
      data: newAdopt
    });
  } catch (error) {
    console.error("Error creating adoption request:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// GET ALL ADOPTION REQUESTS (Admin) - with user data populated
const getAllAdoptRequests = async (req, res) => {
  try {
    const allAdopts = await adoptTable.find()
      .populate('userId', 'name email phone')
      .sort({ requestDate: -1 });
    res.status(200).json({
      message: "Adoption requests fetched successfully",
      alladopts: allAdopts
    });
  } catch (error) {
    console.error("Error fetching adoption requests:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// GET USER'S ADOPTION REQUESTS (User)
const getUserAdopts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userAdopts = await adoptTable.find({ userId })
      .sort({ requestDate: -1 });
    res.status(200).json({
      message: "User adoption requests fetched",
      useradopts: userAdopts
    });
  } catch (error) {
    console.error("Error fetching user adoption requests:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// GET USER'S ADOPTION REQUESTS (Authenticated - using token)
const getMyAdopts = async (req, res) => {
  try {
    const userId = req.userid;
    const userAdopts = await adoptTable.find({ userId })
      .sort({ requestDate: -1 });
    res.status(200).json({
      message: "User adoption requests fetched",
      useradopts: userAdopts
    });
  } catch (error) {
    console.error("Error fetching user adoption requests:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// GET SINGLE ADOPTION REQUEST
const getSingleAdopt = async (req, res) => {
  try {
    const adoptId = req.params.id;
    const adopt = await adoptTable.findById(adoptId)
      .populate('userId', 'name email phone address');
    if (!adopt) {
      return res.status(404).json({ message: "Adoption request not found" });
    }
    res.status(200).json({
      message: "Adoption request fetched",
      adopt: adopt
    });
  } catch (error) {
    console.error("Error fetching adoption request:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// UPDATE ADOPTION REQUEST STATUS (Admin)
const updateAdoptStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const adoption = await adoptTable.findById(id);
    if (!adoption) {
      return res.status(404).json({ message: "Adoption request not found" });
    }
    
    adoption.status = status;
    
    if (status === 'Approved') {
      adoption.adoptionDate = new Date();
      // Update pet status to Adopted and remove from available listings
      if (adoption.petId) {
        await Pet.findByIdAndUpdate(adoption.petId, { 
          status: 'Adopted', 
          adoptedBy: adoption.userId,
          adoptionDate: new Date()
        });
      }
    } else if (status === 'Rejected') {
      // If rejected, make pet available again if it was pending
      if (adoption.petId) {
        const pet = await Pet.findById(adoption.petId);
        if (pet && pet.status === 'Pending') {
          await Pet.findByIdAndUpdate(adoption.petId, { status: 'Available' });
        }
      }
    }
    
    await adoption.save();
    
    res.status(200).json({
      message: `Adoption ${status.toLowerCase()} successfully`,
      data: adoption
    });
  } catch (error) {
    console.error("Error updating adoption status:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const jwt = require("jsonwebtoken");
const SECRET_KEY = "product-crud";

// Helper to verify token if provided
const verifyToken = (token) => {
  try {
    const trimmedToken = token.trim();
    const decoded = jwt.verify(trimmedToken, SECRET_KEY);
    return decoded.id;
  } catch (error) {
    return null;
  }
};

// UPDATE ADOPTION REQUEST (User or Admin)
const updateAdoptRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.header("auth-token");
    let requestUserId = null;
    
    if (token) {
      requestUserId = verifyToken(token);
      if (!requestUserId) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }
    }
    
    const existingAdopt = await adoptTable.findById(id);
    if (!existingAdopt) {
      return res.status(404).json({ message: "Adoption request not found" });
    }
    
    // If token provided, user must own the adoption request and it must be pending
    if (requestUserId) {
      if (existingAdopt.userId.toString() !== requestUserId) {
        return res.status(403).json({ message: "Not authorized to update this adoption request" });
      }
      if (existingAdopt.status !== 'Pending') {
        return res.status(400).json({ message: "Cannot edit an adoption request that is not pending" });
      }
    }
    // If no token, assume admin action; allow any updates
    
    const updateData = req.body;
    const updatedAdopt = await adoptTable.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    res.status(200).json({
      message: "Adoption request updated successfully",
      data: updatedAdopt
    });
  } catch (error) {
    console.error("Error updating adoption request:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// DELETE ADOPTION REQUEST (User or Admin)
const deleteAdoptRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.header("auth-token");
    let requestUserId = null;
    
    if (token) {
      requestUserId = verifyToken(token);
      if (!requestUserId) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }
    }
    
    const adopt = await adoptTable.findById(id);
    if (!adopt) {
      return res.status(404).json({ message: "Adoption request not found" });
    }
    
    // If token provided, user must own the adoption request
    if (requestUserId) {
      if (adopt.userId.toString() !== requestUserId) {
        return res.status(403).json({ message: "Not authorized to delete this adoption request" });
      }
      // Prevent deleting if already approved
      if (adopt.status === 'Approved') {
        return res.status(400).json({ message: "Cannot delete an approved adoption request" });
      }
    }
    // If no token, assume admin action; allow deletion
    
    await adoptTable.findByIdAndDelete(id);
    
    res.status(200).json({
      message: "Adoption request deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting adoption request:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  createAdoptRequest,
  getAllAdoptRequests,
  getUserAdopts,
  getMyAdopts,
  getSingleAdopt,
  updateAdoptStatus,
  updateAdoptRequest,
  deleteAdoptRequest
};
