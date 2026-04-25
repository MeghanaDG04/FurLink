const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../Middleware/Auth');
const { getAllPets, getSinglePet, createPet, updatePet, deletePet, getAllPetsAdmin} = require('../Controller/PetController');

// User routes
router.get('/getall', getAllPets);
router.get('/single/:id', getSinglePet);

// Admin routes
router.post('/create', verifyToken, isAdmin, createPet);
router.put('/update/:id', verifyToken, isAdmin, updatePet);
router.delete('/delete/:id', verifyToken, isAdmin, deletePet);
router.get('/admin/all', verifyToken, isAdmin, getAllPetsAdmin);

module.exports = router;
