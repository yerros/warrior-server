const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
    teamName: {
        type: String,
        required: true
    },
    teamLogo: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    city: {
        type: String
    }
})

module.exports = mongoose.model('team', teamSchema)