const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    colors: [{
        type: String
    }],
    icon: {
        type: String
    }
})

exports.Category = mongoose.model('Categories', categorySchema)

