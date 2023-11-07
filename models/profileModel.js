const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema(
    {
    
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        dob: {
            type: Date,
            default: Date.now
        },
        contactNumber: {
            type: Number
        },
        address: String,
        profilePic: String
    }
);

const profileModel = new mongoose.model('profile', profileSchema);

module.exports =profileModel