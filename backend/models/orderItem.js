import mongoose from 'mongoose';

const orderItemSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        required: true
    },
    size: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Size',
        default: null,
    },
});

orderItemSchema.virtual('id').get(function() {
    return this._id.toHexString()
})

orderItemSchema.set('toJSON', {
    virtuals: true
})

export default mongoose.model('OrderItem', orderItemSchema);