import express from "express";
import { createOrder, getOrders, updateOrderStatus } from "../controllers/order.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", verifyToken, createOrder);

router.get("/:userId", verifyToken, getOrders);

router.put("/:orderId", verifyToken, updateOrderStatus);

export default router;
