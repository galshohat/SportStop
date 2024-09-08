import express from "express";
import User from "../models/user.js";
import OrderItem from "../models/orderItem.js";
import Product from "../models/products.js";
import Size from "../models/size.js";

const router = express.Router();

router.put("/cart/:id", async (req, res) => {
  try {
    const { productId, quantity, size } = req.body;
    const user = await User.findById(req.params.id)
      .populate({
        path: "cart",
        populate: [
          {
            path: "product",
            select: "name price image colors sizes",
            populate: [
              { path: "sizes", select: "name" },
              { path: "colors", select: "name" },
            ],
          },
          { path: "size", select: "name" },
        ],
      })
      .lean();

    let sizeObject = { _id: undefined, name: "N/A" };
    if (size) sizeObject = await Size.findOne({ name: size }).lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    if (size && !sizeObject) return res.status(400).json({ message: "Size not found" });

    const existingOrderItem = user.cart.find((item) => {
      const productMatch = item.product._id.toString() === productId;
      const sizeMatch = (!item.size && !sizeObject._id) || (item.size && sizeObject._id && item.size._id?.toString() === sizeObject._id?.toString());
      return productMatch && sizeMatch;
    });

    const product = await Product.findById(productId).select("countStock");
    if (product) {
      if (existingOrderItem) {
        const currentOrderItem = await OrderItem.findById(existingOrderItem._id).lean();
        const newQuantity = (currentOrderItem.quantity || 0) + parseInt(quantity || 1);
        if (newQuantity > product.countStock) {
          return res.status(400).json({
            message: `Cannot add more items. Only ${product.countStock - currentOrderItem.quantity} items are available in stock.`,});
        }

        await OrderItem.findByIdAndUpdate(existingOrderItem._id, {
          $inc: { quantity: quantity || 1 },
        });

        const updatedUser = await User.findById(req.params.id)
          .populate({
            path: "cart",
            populate: [
              {
                path: "product",
                select: "name price image colors sizes",
                populate: [
                  { path: "sizes", select: "name" },
                  { path: "colors", select: "name" },
                ],
              },
              { path: "size", select: "name" },
            ],
          })
          .lean();

        return res.status(200).json({
          message: "Product quantity updated in cart.",
          updatedUser,
        });
      } else {
        if (product.countStock < quantity) {
          return res.status(400).json({
            message: `There are only ${product.countStock} in Stock right now, please change the quantity`,
          });
        }
      }
    } else {
      return res.status(404).json({ message: "Product not found" });
    }

    const orderItem = new OrderItem({
      product: productId,
      quantity,
      size: sizeObject._id ? sizeObject._id : null,
    });

    await Promise.all([
      orderItem.save(),
      User.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            cart: orderItem._id,
            CartActivity: new Date(Date.now() + 3 * 60 * 60 * 1000),
          },
        },
        { new: true }
      ),
    ]);

    const updatedUser = await User.findById(req.params.id)
      .populate({
        path: "cart",
        populate: [
          {
            path: "product",
            select: "name price image colors sizes",
            populate: [
              { path: "sizes", select: "name" },
              { path: "colors", select: "name" },
            ],
          },
          { path: "size", select: "name" },
        ],
      })
      .lean();

    return res.status(200).json({
      message: "Product added to cart successfully.",
      updatedUser,
      orderItem: orderItem._id
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

router.get("/cart-items/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const user = await User.findById(userId).populate({
      path: "cart",
      populate: [
        {
          path: "product",
          select: "name price image colors sizes countStock",
          populate: [
            { path: "sizes", select: "name" },
            { path: "colors", select: "name" },
          ],
        },
        { path: "size", select: "name" },
      ],
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.cart);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.delete("/cart-items/:userId/:orderItemId", async (req, res) => {
  try {
    const { userId, orderItemId } = req.params;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.cart = user.cart.filter((item) => item.toString() !== orderItemId);
    await user.save();
    await OrderItem.findByIdAndDelete(orderItemId);

    const updatedUser = await User.findById(userId).populate({
      path: "cart",
      populate: [
        {
          path: "product",
          select: "name price image colors sizes countStock",
          populate: [
            { path: "sizes", select: "name" },
            { path: "colors", select: "name" },
          ],
        },
        { path: "size", select: "name" },
      ],
    });

    res.json(updatedUser);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

router.put("/cart-items/:userId/:orderItemId", async (req, res) => {
  try {
    const { userId, orderItemId } = req.params;
    const { quantity, size } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const cartItem = user.cart.find((item) => item.toString() === orderItemId);
    if (!cartItem) return res.status(404).json({ message: "Cart item not found" });

    const orderItem = await OrderItem.findById(cartItem).populate("product");
    if (!orderItem) return res.status(404).json({ message: "Order item not found" });

    if (orderItem.product.countStock < quantity) {
      return res.status(400).json({
        message: `There are only ${orderItem.product.countStock} in Stock right now, please change the quantity`,
      });
    }

    orderItem.quantity = quantity || orderItem.quantity;
    orderItem.size = size || orderItem.size;
    await orderItem.save();

    const updatedUser = await User.findById(userId).populate({
      path: "cart",
      populate: [
        {
          path: "product",
          select: "name price image colors sizes",
          populate: [
            { path: "sizes", select: "name" },
            { path: "colors", select: "name" },
          ],
        },
        { path: "size", select: "name" },
      ],
    });

    res.json({
      message: "Cart item updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

export default router;