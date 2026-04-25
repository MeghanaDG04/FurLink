const express = require('express');
const {
  createAdoptRequest,
  getAllAdoptRequests,
  getUserAdopts,
  getMyAdopts,
  getSingleAdopt,
  updateAdoptStatus,
  updateAdoptRequest,
  deleteAdoptRequest
} = require('../Controller/AdoptController');

const { verifyToken } = require('../Middleware/Auth');

const route = express.Router();

// User routes
route.post('/create', verifyToken, createAdoptRequest);
route.get('/user/:userId', getUserAdopts);
route.get('/myadopts', verifyToken, getMyAdopts);
route.get('/single/:id', getSingleAdopt);
route.put('/update/:id', updateAdoptRequest);
route.delete('/delete/:id', deleteAdoptRequest);

// Admin routes
route.get('/all', getAllAdoptRequests);
route.put('/admin/updatestatus/:id', updateAdoptStatus);

module.exports = route;
