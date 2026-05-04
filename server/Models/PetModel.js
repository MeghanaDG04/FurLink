const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Guinea Pig', 'Fish', 'Other'] },
  breed: { type: String },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  image: { type: String },
  description: { type: String },
  status: { 
    type: String, 
    enum: ['Pending', 'Available', 'Adopted', 'Rejected'], 
    default: 'Pending' 
  },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  adoptedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  adoptionDate: { type: Date }
});

module.exports = mongoose.model('Pet', petSchema);
