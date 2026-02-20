import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  placeOrder,
  userOrders,
  listOrders,
  updateStatus
} from "../controllers/orderController.js";

const orderRouter = express.Router();

// place order (payment simulated)
orderRouter.post("/place", authMiddleware, placeOrder);

// user orders
orderRouter.post("/userorders", authMiddleware, userOrders);

// admin routes
orderRouter.get("/list", listOrders);
orderRouter.post("/status", updateStatus);

export default orderRouter;
