import mongoose from 'mongoose';

const colorSchema = mongoose.Schema({
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

colorSchema.virtual('id').get(function() {
    return this._id.toHexString()
})

colorSchema.set('toJSON', {
    virtuals: true
})

export default mongoose.model('Color', colorSchema)
