const mongoose = require('mongoose')

const orderItemSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    product : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products'
    }
})

module.exports = mongoose.model('Order', orderItemSchema)

