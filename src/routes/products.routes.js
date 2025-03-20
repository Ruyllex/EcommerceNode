import { Router } from "express";
import Product from "../models/product.model.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos', error: error.message });
  }
});

router.post("/", verifyToken, isAdmin, async (req, res) => {
  const { name, price, stock, imageUrl } = req.body;
  const product = await Product.create({ name, price, stock, imageUrl });
  res.status(201).json({ message: "Producto creado", product });
});

export default router;
