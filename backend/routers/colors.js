import express from "express";
import Color from "../models/color.js";
const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const colors = await Color.find();
    res.status(200).json(colors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching colors", error });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const color = await Color.findById(req.params.id);
    if (!color) return res.status(404).json({ message: "Color not found" });
    res.status(200).json(color);
  } catch (error) {
    res.status(500).json({ message: "Error fetching color", error });
  }
});


router.post("/admin", async (req, res) => {
    try {
    console.log('HI')
    const { name, value } = req.body;
    

    const existingColorByName = await Color.findOne({ name });
    if (existingColorByName) {
      return res.status(400).json({ message: "A color with this name already exists." });
    }


    const existingColorByValue = await Color.findOne({ value });
    if (existingColorByValue) {
      return res.status(400).json({ message: "A color with this value already exists." });
    }


    const newColor = new Color({
      name,
      value,
    });
    const color = await newColor.save();
    res.status(201).send(color);
  } catch (error) {
    console.error("Error creating color:", error);
    res.status(500).json({ message: "Error creating color", error });
  }
});


router.put("/:id/admin", async (req, res) => {
  try {
    const { name, value } = req.body;


    const existingColorByName = await Color.findOne({
      name: name,
      _id: { $ne: req.params.id },
    });
    if (existingColorByName) {
      return res
        .status(400)
        .json({ message: "A color with this name already exists." });
    }


    const existingColorByValue = await Color.findOne({
      value: value,
      _id: { $ne: req.params.id },
    });
    if (existingColorByValue) {
      return res
        .status(400)
        .json({ message: "A color with this value already exists." });
    }


    const updatedColor = await Color.findByIdAndUpdate(
      req.params.id,
      {
        name: name,
        value: value,
        dateModified: new Date(Date.now() + 4 * 60 * 60 * 1000),
      },
      { new: true }
    );

    if (!updatedColor)
      return res.status(404).json({ message: "Color not found" });

    res.status(200).send(updatedColor);
  } catch (error) {
    res.status(500).json({ message: "Error updating color", error });
  }
});


router.delete("/:id/admin", async (req, res) => {
  try {
    const color = await Color.findByIdAndDelete(req.params.id);
    if (!color) return res.status(404).json({ message: "Color not found" });
    res.status(200).json({ message: "Color deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting color", error });
  }
});

export default router;