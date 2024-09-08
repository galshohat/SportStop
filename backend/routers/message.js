import express from "express";
import Message from "../models/message.js";
import { wss } from "../app.js";
import WebSocket from "ws";
const router = express.Router();

router.get("/:orderId", async (req, res) => {
  try {
    const messages = await Message.find({ orderId: req.params.orderId }).sort({
      timestamp: 1,
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

router.post("/", async (req, res) => {
  const { orderId, sender, text } = req.body;
  try {
    const newMessage = new Message({ orderId, sender, text });
    await newMessage.save();

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(JSON.stringify(newMessage));
        } catch (wsError) {
          console.error("Error sending WebSocket message:", wsError);
        }
      }
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;