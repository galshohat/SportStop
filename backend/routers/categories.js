import express from "express";
import Category from "../models/category.js";
import Product from "../models/products.js";

const router = express.Router();

router.post('/admin', async (req, res) => {
    const existingCategory = await Category.findOne({ name: req.body.name });

    if (existingCategory) {
        return res.status(400).send('A category with this name already exists');
    }

    let category = new Category({
        name: req.body.name,
    });

    category = await category.save();

    if (!category) return res.status(400).send('The category cannot be created');

    res.send(category);
});

router.get('/', async (req, res) => {
    
    const category = await Category.find()
    
    if (!category) return res.status(400).send('No categories can be found')

    res.send({category})
})

router.delete('/:id/admin', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).send({ message: 'Category not found' });
        }

        await Product.deleteMany({ categories: req.params.id });

        await Category.findByIdAndDelete(req.params.id);

        res.status(200).send({ message: `Category "${category.name}" and its associated products were deleted successfully` });
    } catch (error) {
        console.error('Error deleting category and associated products:', error);
        res.status(500).send({ message: 'An error occurred while deleting the category and its products' });
    }
});

router.put('/:id/admin', async (req, res) => {
    const { name } = req.body;

    
    const existingCategory = await Category.findOne({ name });
    if (existingCategory && existingCategory.id.toString() !== req.params.id) {
        return res.status(400).send('A category with this name already exists.');
    }

    
    const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name,
            dateModified: new Date(Date.now() + 3 * 60 * 60 * 1000),
        },
        { new: true }
    );

    if (!updatedCategory) return res.status(400).send('The category could not be found.');

    res.send(updatedCategory);
});

router.get('/:id/products', async (req, res) => {
    try {
        const categoryId = req.params.id;
        console.log(categoryId)

        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).send({ message: 'Category not found' });
        }

        const products = await Product.find({ categories: categoryId });

        res.status(200).json({ products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send({ message: 'An error occurred while fetching products.' });
    }
});

export default router;