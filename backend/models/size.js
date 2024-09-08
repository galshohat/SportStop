import mongoose from 'mongoose';

const sizeSchema = mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        },
        dateModified: {
            type: Date,
            default: () => new Date(Date.now() + 3 * 60 * 60 * 1000)
        }
})

sizeSchema.virtual('id').get(function() {
    return this._id.toHexString()
})

sizeSchema.set('toJSON', {
    virtuals: true
})

export default mongoose.model('Size', sizeSchema);