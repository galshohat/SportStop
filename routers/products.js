const express = require("express")
const router = express.Router()
const Product = require('../models/products.js')
const { Category } = require("../models/category.js")
const mongoose = require('mongoose')

router.post('/', async (req, res) => {

    const category = await Category.findById(req.body.category)

    let product = new Product({
        name: req.body.name,
        image: req.body.image,
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


module.exports = router