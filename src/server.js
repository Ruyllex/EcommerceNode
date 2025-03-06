import express from "express";
import sequelize from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);

sequelize.sync().then(() => console.log("Base de datos conectada"));

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));

