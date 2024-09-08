import express from "express";
import Size from "../models/size.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const sizes = await Size.find();
    res.status(200).json(sizes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sizes", error });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const size = await Size.findById(req.params.id);
    if (!size) return res.status(404).json({ message: "Size not found" });
    res.status(200).json(size);
  } catch (error) {
    res.status(500).json({ message: "Error fetching size", error });
  }
});


router.post("/admin", async (req, res) => {
    try {
        const { name, value } = req.body;


        const existingSizeByName = await Size.findOne({ name });
        if (existingSizeByName) {
            return res.status(400).json({ message: "A size with this name already exists." });
        }


        const existingSizeByValue = await Size.findOne({ value });
        if (existingSizeByValue) {
            return res.status(400).json({ message: "A size with this value already exists." });
        }


        const newSize = new Size({
            name,
            value,
        });
        const size = await newSize.save();
        res.status(201).send(size);
    } catch (error) {
        console.error("Error creating size:", error);
        res.status(500).json({ message: "Error creating size", error });
    }
});


router.put("/:id/admin", async (req, res) => {
  try {
    const { name, value } = req.body;


    console.log("name:", name);
    console.log("req.params.id:", req.params.id);
    const existingSizeByName = await Size.findOne({
      name: name,
      _id: { $ne: req.params.id },
    });
    console.log("hi");
    if (existingSizeByName) {
      return res
        .status(400)
        .json({ message: "A size with this name already exists." });
    }


    const existingSizeByValue = await Size.findOne({
      value: value,
      _id: { $ne: req.params.id },
    });
    if (existingSizeByValue) {
      return res
        .status(400)
        .json({ message: "A size with this value already exists." });
    }


    const updatedSize = await Size.findByIdAndUpdate(
      req.params.id,
      {
        name: name,
        value: value,
        dateModified: new Date(Date.now() + 4 * 60 * 60 * 1000),
      },
      { new: true } 
    );

    if (!updatedSize)
      return res.status(404).json({ message: "Size not found" });

    res.status(200).send(updatedSize);
  } catch (error) {
    res.status(500).json({ message: "Error updating size", error });
  }
});


router.delete("/:id/admin", async (req, res) => {
  try {
    const size = await Size.findByIdAndDelete(req.params.id);
    if (!size) return res.status(404).json({ message: "Size not found" });
    res.status(200).json({ message: "Size deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting size", error });
  }
});

export default router;
