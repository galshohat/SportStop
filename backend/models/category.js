import mongoose from 'mongoose';

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    productCount: {
        type: Number,
        default: 0
    },
    dateModified: {
        type: Date,
        default: () => new Date(Date.now() + 3 * 60 * 60 * 1000)
    }
})

categorySchema.virtual('id').get(function() {
    return this._id.toHexString()
})

categorySchema.set('toJSON', {
    virtuals: true
})

export default mongoose.model('Categories', categorySchema);


