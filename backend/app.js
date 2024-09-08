import express from "express";
import { initializeDataPersistence } from "./persist.js";
import http from "http";
import { WebSocketServer } from "ws";
import bodyParser from "body-parser";
import morgan from "morgan";
import mongoose from "mongoose";
import cors from "cors";
import auth from "./jwt.js";
import errorHandler from "./error-handler.js";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import xss from "xss-clean";
import hpp from "hpp";
import dotenv from "dotenv";

import productsRouter from "./routers/products-server.js";
import categoriesRouter from "./routers/categories.js";
import ordersRouter from "./routers/orders-server.js";
import sizesRouter from "./routers/sizes.js";
import colorsRouter from "./routers/colors.js";
import adminRouter from "./routers/admin.js";
import messagesRouter from "./routers/message.js";
import registerRouter from "./routers/signup-server.js";
import loginRouter from "./routers/login-server.js";
import profileRouter from "./routers/user-profile-server.js";
import cartRouter from "./routers/cart-server.js";
import couponsRouter from "./routers/stars-server.js";
import currencyRouter from "./routers/currency-server.js";
dotenv.config();
const app = express();
const port = 8000;
const api = process.env.URL;


// Set up HTTP and WebSocket server
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
export { wss }; 

// Set up rate limiter
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: "Too many requests from this IP, please try again later.",
});

// CORS configuration
const corsOptions = {
  origin: `http://localhost:3000`,
  credentials: true,
};

// Middleware setup
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(auth());
app.use(morgan("tiny"));
app.use(errorHandler);
app.use("/uploads", express.static(`${process.cwd()}/uploads`));
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(rateLimiter);

// Set up routes
app.use(`${api}/products`, productsRouter);
app.use(`${api}/users`, registerRouter);
app.use(`${api}/users`, loginRouter);
app.use(`${api}/users`, profileRouter);
app.use(`${api}/users`, cartRouter);
app.use(`${api}/users`, couponsRouter);
app.use(`${api}/users`, currencyRouter);
app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/orders`, ordersRouter);
app.use(`${api}/sizes`, sizesRouter);
app.use(`${api}/colors`, colorsRouter);
app.use(`${api}/admin`, adminRouter);
app.use(`${api}/messages`, messagesRouter);

// Connect to the database
mongoose
  .connect(process.env.DBConnection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("DB connection is ready...");
    await initializeDataPersistence();
  })
  .catch((err) => {
    console.log(err);
  });

// WebSocket event handling
wss.on("connection", (ws, req) => {
  console.log("New WebSocket connection established");

  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});