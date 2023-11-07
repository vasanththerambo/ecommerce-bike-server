const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tokenSchema = new Schema({

    userId:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    token: {
        type: String,
        required:true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires:600
    }
})

const tokenModel = new mongoose.model('Token', tokenSchema);

module.exports = tokenModel
