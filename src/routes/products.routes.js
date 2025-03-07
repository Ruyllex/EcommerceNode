import { Router } from "express";
import Product from "../models/product.model.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
});

router.post("/", verifyToken, isAdmin, async (req, res) => {
  const { name, price, stock, imageUrl } = req.body;
  const product = await Product.create({ name, price, stock, imageUrl });
  res.status(201).json({ message: "Producto creado", product });
});

export default router;
