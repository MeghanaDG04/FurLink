const mongoose = require('mongoose');

const adoptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet' },
  
  petName: { type: String, required: true },
  petType: { type: String, required: true },
  petBreed: { type: String },
  petAge: { type: Number, required: true },
  petGender: { type: String, enum: ['Male', 'Female', 'Other'] },
  petImage: { type: String },
  description: { type: String },
  
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },
  
  requestDate: { type: Date, default: Date.now },
  adoptionDate: { type: Date },
  
  adopterDetails: {
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String, required: true }
  }
});

module.exports = mongoose.model('Adopt', adoptSchema);
