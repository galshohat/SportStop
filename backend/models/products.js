import mongoose from 'mongoose';

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
    isFeatured: {
        type: Boolean,
        default: false
    },
    price: {
        type: Number,
        required: true
    },
    countStock: {
        type: Number,
        required: true,
        min: 0,
        max: 5000
    },
    description: {
        type: String, 
        required: true
    },
    sizes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Size',
        default: 'N/A'
    }],
    colors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Color',
        default: 'N/A'
    }],
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories',
        required: true
    }],
    gender: {
        type: String,
        required: true
    },
    dateModified: {
        type: Date,
        default: () => new Date(Date.now() + 3 * 60 * 60 * 1000)
    }
})

productSchema.virtual('id').get(function() {
    return this._id.toHexString()
})

productSchema.set('toJSON', {
    virtuals: true
})

export default mongoose.model('Products', productSchema)

