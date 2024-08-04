const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    images: [{
        type: String,
        default: ''
    }],
    price: {
        type: Number,
        required: true
    },
    countStock: {
        type: Number,
        required: true,
        min: 0,
        max: 1000
    },
    description: {
        type: String, 
        required: true
    },
    brand: {
        type: String, 
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
})

exports.Product = mongoose.model('Products', productSchema)

