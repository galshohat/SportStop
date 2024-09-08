import express from "express";
import Product from "../models/products.js";
import Category from "../models/category.js";
import Size from "../models/size.js";
import Color from "../models/color.js";
import mongoose from "mongoose";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "..", "uploads");


    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    const isValid = FILE_TYPE_MAP[file.mimetype];

    let error = new Error("Invalid image type");
    if (isValid) {
      error = null;
    }
    cb(error, uploadPath);
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.replace(/ /g, "-");
    const ext = FILE_TYPE_MAP[file.mimetype];
    const timestamp = new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString();
    cb(null, `${fileName}-${timestamp}.${ext}`);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/admin",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "additionalImages", maxCount: 4 },
  ]),
  async (req, res) => {
    try {

      const existingProduct = await Product.findOne({ name: req.body.name });
      if (existingProduct) {
        return res.status(400).send("A product with this name already exists");
      }


      const categoryIds = req.body.categories
        ? req.body.categories.split(",")
        : [];
      if (!categoryIds.length)
        return res.status(400).send("At least one category is required.");

      const validCategories = await Category.find({
        _id: { $in: categoryIds },
      });
      if (validCategories.length !== categoryIds.length)
        return res.status(400).send("One or more invalid categories.");


      const sizeIds = req.body.sizes ? req.body.sizes.split(",") : [];
      let validSizes = [];
      if (sizeIds.length > 0) {
        validSizes = await Size.find({ _id: { $in: sizeIds } });
        if (validSizes.length !== sizeIds.length)
          return res.status(400).send("One or more invalid sizes.");
      }


      const colorIds = req.body.colors ? req.body.colors.split(",") : [];
      let validColors = [];
      if (colorIds.length > 0) {
        validColors = await Color.find({ _id: { $in: colorIds } });
        if (validColors.length !== colorIds.length)
          return res.status(400).send("One or more invalid colors.");
      }

      const mainImage = req.files["mainImage"]
        ? req.files["mainImage"][0]
        : null;
      const additionalImages = req.files["additionalImages"] || [];

      if (!mainImage)
        return res.status(400).send("No main image in the request");

      const mainImageUrl = `${req.protocol}://${req.get("host")}/uploads/${mainImage.filename}`;
      const additionalImageUrls = additionalImages.map(
        (file) =>
          `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
      );

      let product = new Product({
        name: req.body.name,
        image: mainImageUrl,
        price: req.body.price,
        countStock: req.body.stockAmount,
        description: req.body.description,
        categories: validCategories,
        colors: validColors,
        sizes: validSizes,
        isFeatured: req.body.featured,
        images: additionalImageUrls,
        gender: req.body.gender,
      });

      product = await product.save();
      if (!product)
        return res.status(500).send("The product cannot be created");

      res.status(201).send(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).send("An error occurred while creating the product.");
    }
  }
);

router.get("/", async (req, res) => {
  const products = await Product.find()
    .populate("categories")
    .populate("sizes")
    .populate("colors");
  res.send(products);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).send("Invalid product id");
  }

  const product = await Product.findById(id).populate("categories", "name");

  if (!product) {
    return res.status(404).send("Product not found");
  }

  res.send(product);
});

router.delete("/:id/admin", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).send("Invalid product id");
  }

  const product = await Product.findByIdAndDelete(id);
  console.log(product);
  if (!product) {
    return res.status(404).send("Product not found");
  }


  if (product.image) {
    const mainImagePath = path.join(
      __dirname,
      "../uploads",
      path.basename(product.image)
    );
    if (fs.existsSync(mainImagePath)) {
      fs.unlinkSync(mainImagePath);
    }
  }


  if (product.images && product.images.length > 0) {
    product.images.forEach((image) => {
      const imagePath = path.join(
        __dirname,
        "../uploads",
        path.basename(image)
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });
  }

  res.send({
    message: "Product and associated images deleted successfully",
    product,
  });
});


router.put(
  "/:id/admin",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "additionalImages", maxCount: 4 },
  ]),
  async (req, res) => {
    try {
      const productId = req.params.id;


      const existingProduct = await Product.findById(productId);
      if (!existingProduct) return res.status(404).send("Product not found");


      const categoryIds = req.body.categories
        ? req.body.categories.split(",")
        : [];
      if (!categoryIds.length)
        return res.status(400).send("At least one category is required.");
      const validCategories = await Category.find({
        _id: { $in: categoryIds },
      });
      if (validCategories.length !== categoryIds.length)
        return res.status(400).send("One or more invalid categories.");


      const sizeIds = req.body.sizes ? req.body.sizes.split(",") : [];
      let validSizes = [];
      if (sizeIds.length > 0) {
        validSizes = await Size.find({ _id: { $in: sizeIds } });
        if (validSizes.length !== sizeIds.length)
          return res.status(400).send("One or more invalid sizes.");
      }


      const colorIds = req.body.colors ? req.body.colors.split(",") : [];
      let validColors = [];
      if (colorIds.length > 0) {
        validColors = await Color.find({ _id: { $in: colorIds } });
        if (validColors.length !== colorIds.length)
          return res.status(400).send("One or more invalid colors.");
      }


      let mainImageUrl = existingProduct.image;
      let additionalImageUrls = [...existingProduct.images];


      const existingImages = req.body.existingImages
        ? req.body.existingImages.split(",")
        : [];
      const imagesToDelete = existingProduct.images.filter(
        (img) => !existingImages.includes(img)
      );


      if (req.files["mainImage"]) {
        const mainImage = req.files["mainImage"][0];


        if (
          existingProduct.image &&
          !existingImages.includes(existingProduct.image)
        ) {
          const oldMainImagePath = path.join(
            __dirname,
            "../uploads",
            path.basename(existingProduct.image)
          );
          if (fs.existsSync(oldMainImagePath)) {
            fs.unlinkSync(oldMainImagePath);
          }
        }

        mainImageUrl = `${req.protocol}://${req.get("host")}/uploads/${mainImage.filename}`;
      }


      imagesToDelete.forEach((image) => {
        const imagePath = path.join(
          __dirname,
          "../uploads",
          path.basename(image)
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });


      if (req.files["additionalImages"]) {
        const newAdditionalImages = req.files["additionalImages"].map(
          (file) =>
            `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
        );
        additionalImageUrls = existingImages.concat(newAdditionalImages);
      } else {
        additionalImageUrls = existingImages; 
      }

      console.log(req.body.featured, existingProduct.isFeatured);

      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
          name: req.body.name || existingProduct.name,
          image: mainImageUrl,
          price: req.body.price || existingProduct.price,
          countStock: req.body.stockAmount || existingProduct.countStock,
          description: req.body.description || existingProduct.description,
          categories: validCategories,
          colors: validColors,
          sizes: validSizes,
          isFeatured: req.body.featured,
          images: additionalImageUrls,
          dateModified: new Date(Date.now() + 3 * 60 * 60 * 1000),
          gender: req.body.gender,
        },
        { new: true } 
      )
        .populate("categories")
        .populate("sizes")
        .populate("colors");

      if (!updatedProduct)
        return res.status(500).send("The product cannot be updated");

      res.status(200).send(updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).send("An error occurred while updating the product.");
    }
  }
);

export default router;
