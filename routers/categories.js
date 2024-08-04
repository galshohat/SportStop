const express = require("express")
const router = express.Router()
const {Category} = require('../models/category.js')

router.post('/', async (req, res) => {
    const category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        colors: req.body.colors
    })
    
    category = await category.save()
    
    // if !category

    res.send(category)
})

router.get('/', async (req, res) => {
    const category = await Category.find()
    
    // if !category

    res.send(category)
})

router.put('/:id', async (req,res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid category id')
    }
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon,
            colors: req.body.colors
        },
        { new : true }
    )

    if (!category) return res.status(400).send('the category cannot be found')

    res.send(category)
})

router.delete('/', re )

module.exports = router