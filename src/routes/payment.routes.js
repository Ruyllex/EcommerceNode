import express from 'express';
import { processPayment } from '../controllers/payment.controller.js';
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post('/process-payment', verifyToken, processPayment);

export default router;
