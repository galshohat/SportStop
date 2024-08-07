const express = require("express")
const router = express.Router()
const Product = require('../models/products.js')
const Category = require("../models/category.js")
const mongoose = require('mongoose')
const multer = require('multer')

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype]
        let error = new Error('Invalid image type')
        if(isValid){
            error = null
        }
        cb(error, 'uploads')
    },
    filename: function (req, file, cb) {
      const fileName = file.originalname.replace(' ','-')
      const ext = FILE_TYPE_MAP[file.mimetype]
      cb(null, `${fileName}-${Date.now()}.${ext}`)
    }
  })
  
const upload = multer({ storage: storage })

router.post('/', upload.single('image'), async (req, res) => {

    const category = await Category.findById(req.body.category)
    // if ! category
    const file = req.file
    if (!file) return res.status(400).send('No image in the request')

    const fileName = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` 

    let product = new Product({
        name: req.body.name,
        image: fileName,
        price: req.body.price,
        countStock: req.body.countStock,
        description: req.body.description,
        category: req.body.category,
        brand: req.body.brand
    })
    
    product = await product.save()

    res.send(product)

})

router.get('/', async (req, res) => {
    const products = await Product.find()
    res.send(products)
})

router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category')
    
    // if !category

    res.send(product)
})


router.put('/:id', async (req,res) => {
    
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid product id')
    }

    const category = await Category.findById(req.body.category)

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            image: req.body.image,
            price: req.body.price,
            countStock: req.body.countStock,
            description: req.body.description,
            category: req.body.category,
            brand: req.body.brand
        },
        { new : true }
    )

    if (!product) return res.status(400).send('the category cannot be found')

    res.send(product)
})


router.delete('/:id', async (req,res) => {
    const product = await Product.findByIdAndRemove(req.params.id)
    
    if (!product) return res.status(400).send('the category cannot be found')
    
    res.send(product)
})

router.put('/gallery-images/:id',upload.array('images', 4), async (req,res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid product id')
    }
    const path = `${req.protocol}://${req.get('host')}/uploads/` 
    let imagesArray = []
    const files = req.files
    if(!files) return res.status(400).send('No images in the request')
    
    files.map(file =>{
        imagesArray.push(`${path}${file.fileName}`)
    })

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            images: imagesArray
        },
        { new : true }
    )

    if (!product) return res.status(400).send('the category cannot be found')

    res.send(product)
})


module.exports = router