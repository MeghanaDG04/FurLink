const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    category : {type: String},
    description : {type: String}
})

module.exports = mongoose.model("Category", categorySchema)