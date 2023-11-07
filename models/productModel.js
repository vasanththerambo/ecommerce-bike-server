const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required:true
    },
    price: {
        type: Number,
        required:true
    },
    image: String,
    brand: String,
    offer: Number,
    engine: Number,
    power: Number,
    torque: Number
    
})

const productModel = new mongoose.model('product', productSchema);

module.exports = productModel;

