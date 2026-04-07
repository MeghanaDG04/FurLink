const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone : { type: Number },
    address: { type: String}
})

module.exports = mongoose.model('User', userSchema)