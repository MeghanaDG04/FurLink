const Pet = require('../Models/PetModel');
const Adopt = require('../Models/AdoptModel');

// Get all available pets (for users)
const getAllPets = async (req, res) => {
  try {
    const pets = await Pet.find({ status: 'Available' }).sort({ createdAt: -1 });
    res.json({ success: true, pets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single pet details
const getSinglePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ success: false, message: 'Pet not found' });
    res.json({ success: true, pet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new pet (admin only) - creates directly as Available
const createPet = async (req, res) => {
  try {
    const { name, type, breed, age, gender, image, description } = req.body;
    const pet = new Pet({
      name,
      type,
      breed,
      age: Number(age),
      gender,
      image,
      description,
      status: 'Available', // Admin-created pets are immediately available
      submittedBy: req.userid // Track admin as submitter
    });
    await pet.save();
    res.json({ success: true, message: 'Pet added successfully', pet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Submit pet for approval (user)
const submitPet = async (req, res) => {
  try {
    const { name, type, breed, age, gender, image, description } = req.body;
    const pet = new Pet({
      name,
      type,
      breed,
      age: Number(age),
      gender,
      image,
      description,
      status: 'Pending',
      submittedBy: req.userid
    });
    await pet.save();
    res.json({ success: true, message: 'Pet submitted for approval successfully', pet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get my submitted pets (user)
const getMyPets = async (req, res) => {
  try {
    const pets = await Pet.find({ submittedBy: req.userid }).sort({ createdAt: -1 });
    res.json({ success: true, pets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update my pending pet submission (user can only update pending pets)
const updateMyPet = async (req, res) => {
  try {
    const pet = await Pet.findOne({
      _id: req.params.id,
      submittedBy: req.userid,
      status: 'Pending'
    });
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found or not pending' });
    }
    const { name, type, breed, age, gender, image, description } = req.body;
    const updatedPet = await Pet.findByIdAndUpdate(
      req.params.id,
      { name, type, breed, age: Number(age), gender, image, description },
      { new: true }
    );
    res.json({ success: true, message: 'Pet updated successfully', pet: updatedPet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Withdraw pet submission (user deletes their pending pet)
const withdrawPet = async (req, res) => {
  try {
    const pet = await Pet.findOne({
      _id: req.params.id,
      submittedBy: req.userid,
      status: 'Pending'
    });
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found or cannot be withdrawn' });
    }
    await Pet.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Pet submission withdrawn successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update pet (admin) - can update any field including status
const updatePet = async (req, res) => {
  try {
    const { name, type, breed, age, gender, image, description, status } = req.body;
    const pet = await Pet.findByIdAndUpdate(
      req.params.id,
      { 
        name, 
        type, 
        breed, 
        age: Number(age), 
        gender, 
        image, 
        description, 
        status 
      },
      { new: true }
    );
    if (!pet) return res.status(404).json({ success: false, message: 'Pet not found' });
    res.json({ success: true, message: 'Pet updated successfully', pet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete pet (admin only)
const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) return res.status(404).json({ success: false, message: 'Pet not found' });
    res.json({ success: true, message: 'Pet deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all pets for admin (including all statuses)
const getAllPetsAdmin = async (req, res) => {
  try {
    const pets = await Pet.find().sort({ createdAt: -1 });
    res.json({ success: true, pets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve pet (admin)
const approvePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ success: false, message: 'Pet not found' });
    if (pet.status !== 'Pending') {
      return res.status(400).json({ success: false, message: 'Only pending pets can be approved' });
    }
    pet.status = 'Available';
    await pet.save();
    res.json({ success: true, message: 'Pet approved successfully', pet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reject pet (admin)
const rejectPet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ success: false, message: 'Pet not found' });
    if (pet.status !== 'Pending') {
      return res.status(400).json({ success: false, message: 'Only pending pets can be rejected' });
    }
    pet.status = 'Rejected';
    await pet.save();
    res.json({ success: true, message: 'Pet rejected successfully', pet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update adoption status and pet status
const updateAdoptionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const adoption = await Adopt.findById(req.params.id);
    if (!adoption) return res.status(404).json({ success: false, message: 'Adoption request not found' });

    adoption.status = status;
    if (status === 'Approved') {
      adoption.adoptionDate = new Date();
      // Update pet status to Adopted and remove from available listings
      await Pet.findByIdAndUpdate(adoption.petId, { 
        status: 'Adopted', 
        adoptedBy: adoption.userId,
        adoptionDate: new Date()
      });
    } else if (status === 'Rejected') {
      // If rejected, make pet available again if it was pending
      if (adoption.petId) {
        await Pet.findByIdAndUpdate(adoption.petId, { status: 'Available' });
      }
    }
    await adoption.save();
    res.json({ success: true, message: `Adoption ${status.toLowerCase()} successfully`, adoption });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllPets,
  getSinglePet,
  createPet,
  submitPet,
  getMyPets,
  updateMyPet,
  withdrawPet,
  updatePet,
  deletePet,
  getAllPetsAdmin,
  approvePet,
  rejectPet,
  updateAdoptionStatus
};
