import express from "express";
import { createOrder, getOrders, updateOrderStatus } from "../controllers/order.controller.js";

const router = express.Router();


router.post("/", createOrder);

router.get("/:userId", getOrders);


router.put("/:orderId", updateOrderStatus);

export default router;
