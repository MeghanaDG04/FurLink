const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../Middleware/Auth');
const {
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
  rejectPet
} = require('../Controller/PetController');

// User routes (public)
router.get('/getall', getAllPets);
router.get('/single/:id', getSinglePet);

// User routes (authenticated)
router.post('/submit', verifyToken, submitPet);
router.get('/my-pets', verifyToken, getMyPets);
router.put('/update-submission/:id', verifyToken, updateMyPet);
router.delete('/withdraw/:id', verifyToken, withdrawPet);

// Admin routes
router.post('/create', verifyToken, isAdmin, createPet);
router.put('/update/:id', verifyToken, isAdmin, updatePet);
router.delete('/delete/:id', verifyToken, isAdmin, deletePet);
router.get('/admin/all', verifyToken, isAdmin, getAllPetsAdmin);
router.put('/admin/approve/:id', verifyToken, isAdmin, approvePet);
router.put('/admin/reject/:id', verifyToken, isAdmin, rejectPet);

module.exports = router;
