import Order from "../models/order.js";
import OrderItem from "../models/orderItem.js";
import Product from "../models/products.js";
import Size from "../models/size.js";
import User from "../models/user.js";
import Category from "../models/category.js";
import Message from "../models/message.js";
import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name")
      .sort({ orderDate: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send("Server Error");
  }
});

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ user: userId })
      .populate("user", "name") 
      .sort({ orderDate: -1 }); 

    if (!orders) {
      return res.status(404).json({ message: "No orders found for this user." });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send("Server Error");
  }
});

router.get("/user-profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const orders = await Order.find({ user: userId }).sort({ orderDate: -1 });

    const totalPayments = orders.reduce(
      (total, order) => total + order.orderPrice,
      0
    );

    const lastPurchase = orders.length > 0 ? orders[0].orderDate : null;

    const totalOrders = orders.length;

    const formattedOrders = orders.map((order) => ({
      date: order.orderDate,
      totalPrice: order.orderPrice,
    }));

    res.status(200).json({
      totalPayments: totalPayments.toFixed(2),
      lastPurchase,
      totalOrders,
      orders: formattedOrders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send("Server Error");
  }
});

router.get("/check-token/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const order = await Order.findOne({ token });

    if (order) {
      return res.json({ isUnique: false });
    }

    res.json({ isUnique: true });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      city,
      country,
      phone,
      user,
      token,
      stars,
      discount,
      couponCode,
    } = req.body;

    if (
      !orderItems ||
      !shippingAddress ||
      !city ||
      !country ||
      !phone ||
      !token ||
      !user ||
      stars === undefined
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }


    const enrichedOrderItems = await Promise.all(
      orderItems.map(async (item) => {
        const product = await Product.findById(item.product.id).select(
          "name price image categories"
        );

        const categoryNames = await Promise.all(
          product.categories.map(async (categoryId) => {
            const category = await Category.findById(categoryId).select("name");
            return category ? category.name : "Unknown Category";
          })
        );

        let size = {
          id: null,
          name: "N/A",
        };
        if (item.size) size = await Size.findById(item.size).select("name");

        return {
          product: {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            categories: categoryNames,
          },
          quantity: item.quantity,
          size: {
            id: size.id,
            name: size.name,
          },
        };
      })
    );


    let orderPrice = enrichedOrderItems.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    let discountString = "N/A"
    if (discount && couponCode) {
      orderPrice = orderPrice * discount;
      const label = 100 - (discount * 100)
      discountString = label.toString() + "%"
    }


    const newOrder = new Order({
      orderItems: enrichedOrderItems,
      shippingAddress,
      city,
      country,
      phone,
      user,
      token,
      orderPrice,
      discount: discountString
    });

    const savedOrder = await newOrder.save();

    await Promise.all(
      orderItems.map(async (item) => {
        const product = await Product.findById(item.product.id).select(
          "countStock"
        );
        if (product) {
          const updatedStock = Math.max(product.countStock - item.quantity, 0); 
          await Product.findByIdAndUpdate(item.product.id, {
            countStock: updatedStock,
          });
        }
      })
    );

    const orderItemIds = orderItems.map((item) => item.id);
    await OrderItem.deleteMany({ _id: { $in: orderItemIds } });

    const updatedUser = await User.findByIdAndUpdate(
      user,
      {
        $set: { cart: [] },
        $inc: { stopPoints: Math.round(parseFloat(stars)) },
        ...(couponCode && {
          $pull: { coupons: { code: couponCode } },
        }),
      },
      { new: true }
    ).lean();

    res.status(201).json({
      order: savedOrder,
      updatedUser: { ...updatedUser, id: updatedUser._id.toString() },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

router.put("/:orderId/admin", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "Shipped", "Completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status provided." });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate("user", "name");

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


router.delete("/:id/admin", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    await Promise.all(
      order.orderItems.map(async (orderItem) => {
        await Product.findByIdAndUpdate(orderItem.product.id, {
          $inc: { countStock: orderItem.quantity },
        });
      })
    );

    const user = order.user;
    if (user) {
      const orderStopPoints = Number(order.orderPrice * 0.1) || 0;
      user.stopPoints = Math.round(Math.max(0, user.stopPoints - orderStopPoints));
      await user.save();
    }

    await Message.deleteMany({ orderId: order._id });

    await Order.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "The order, associated chat messages, and points have been updated.",
    });
  } catch (err) {
    console.error("Error deleting order:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
