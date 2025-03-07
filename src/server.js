import express from "express";
import sequelize from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from './routes/products.routes.js';
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from './routes/payment.routes.js';

const app = express();
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use('/api/payment', paymentRoutes);

//DB
sequelize.sync()
    .then(() => console.log("Base de datos conectada"))
    .catch((err) => console.error("Error al conectar la base de datos", err));

//PORT
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));

