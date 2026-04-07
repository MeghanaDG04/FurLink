const mongoose = require('mongoose');
//handle connection to the database and export it to be used in other parts of the application

const CONNECTION_URI = 'mongodb://localhost:27017/PET_APP'; 
// mongodb://localhost:27017 = connection link
// PET_APP = database name

const dbconnection = async () => {
    try {
        await mongoose.connect(CONNECTION_URI)
        console.log('Database connected successfully')
    } catch (error) {
        console.error('Error connecting to MongoDB:', error)    
    }
}

module.exports = dbconnection;  