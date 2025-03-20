import { Router } from "express";
import { 
  getOrCreateCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  getAllActiveCarts,
  processWeeklyOrders,
  getUserCarts
} from "../controllers/cart.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// Rutas públicas (temporalmente sin autenticación para pruebas)
router.get("/:userId", getOrCreateCart);
router.post("/:userId/items", addToCart);
router.put("/items/:cartItemId", updateCartItem);
router.delete("/items/:cartItemId", removeFromCart);

router.get('/users/:userId/carts', verifyToken, getUserCarts);
// Rutas de administrador (temporalmente sin autenticación para pruebas)
router.get("/admin/all", getAllActiveCarts);
router.post("/admin/process-weekly", processWeeklyOrders);

export default router;
