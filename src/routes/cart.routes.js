import { Router } from "express";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/add", verifyToken, async (req, res) => {
  const { productId, quantity } = req.body;
  const product = await Product.findByPk(productId);
  if (!product) return res.status(404).json({ message: "Producto no encontrado" });

  const cartItem = await Cart.create({
    userId: req.user.id,
    productId,
    quantity,
  });

  res.status(201).json({ message: "Producto agregado al carrito", cartItem });
});

router.get("/", verifyToken, async (req, res) => {
  const cartItems = await Cart.findAll({
    where: { userId: req.user.id },
    include: [Product],
  });

  res.json(cartItems);
});

export default router;
