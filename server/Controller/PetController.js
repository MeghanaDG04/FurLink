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

// Create new pet (admin)
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
      description
    });
    await pet.save();
    res.json({ success: true, message: 'Pet added successfully', pet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update pet (admin)
const updatePet = async (req, res) => {
  try {
    const { name, type, breed, age, gender, image, description, status } = req.body;
    const pet = await Pet.findByIdAndUpdate(
      req.params.id,
      { name, type, breed, age: Number(age), gender, image, description, status },
      { new: true }
    );
    if (!pet) return res.status(404).json({ success: false, message: 'Pet not found' });
    res.json({ success: true, message: 'Pet updated successfully', pet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete pet (admin)
const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) return res.status(404).json({ success: false, message: 'Pet not found' });
    res.json({ success: true, message: 'Pet deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all pets for admin (including adopted)
const getAllPetsAdmin = async (req, res) => {
  try {
    const pets = await Pet.find().sort({ createdAt: -1 });
    res.json({ success: true, pets });
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
  updatePet,
  deletePet,
  getAllPetsAdmin,
  updateAdoptionStatus
};
