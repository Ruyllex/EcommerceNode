import express from "express";
import cors from 'cors';
import sequelize from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from './routes/products.routes.js';
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from './routes/payment.routes.js';
import { initCronJobs } from "./config/cron.js";
import adminRoutes from './routes/admin.routes.js';

// Importar modelos
import User from "./models/user.model.js";
import Product from "./models/product.model.js";
import { Cart, CartItem } from "./models/cart.model.js";
import { Order, OrderItem } from "./models/order.model.js";


const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Ruta temporal para verificar datos
app.get("/api/debug/data", async (req, res) => {
  try {
    const users = await User.findAll();
    const products = await Product.findAll();
    res.json({
      users: users.map(u => ({ id: u.id, name: u.name, email: u.email })),
      products: products.map(p => ({ id: p.id, name: p.name, price: p.price }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rutas regulares
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Función para inicializar la base de datos
const initializeDatabase = async () => {
  try {
    // Primero, eliminar las tablas existentes
    await sequelize.drop();
    console.log('Tablas eliminadas');

    // Luego, crear las tablas nuevamente en orden
    await sequelize.sync({ force: true });
    console.log('Base de datos conectada y tablas recreadas');

    // Crear algunos datos de prueba
    console.log('Creando datos de prueba...');

    // Crear usuario de prueba con ID específico
    const testUser = await User.create({
      id: "33ddf80e-a48d-4437-901e-5313033ae42f",  // ID específico que espera el frontend
      name: "Usuario de Prueba",
      password: "password123",
      role: "customer"
    });
    console.log('Usuario de prueba creado:', testUser.id);

    // Crear usuario administrador
    const adminUser = await User.create({
      id: "admin-uuid-1234",  // ID específico para el administrador
      name: "Administrador",
      password: "adminpassword",
      role: "admin"
    });
    console.log('Usuario administrador creado:', adminUser.id);

    const products = await Product.bulkCreate([
      {
        name: "Yakimeshi",
        description: "Descripción del producto 1",
        price: 5000,
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKhlxQD-acQj3uM9c8lR4ZoTmIvXVL7zEufw&s"
      },
      {
        name: "Takoyaki",
        description: "Takoyaki",
        price: 5000,
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS35qc9rc--3IP5SsaKcNdcjKFq_GsV6gjblg&s"
      },
      {
        name: "Okomiyaki",
        description: "okonomiyaki",
        price: 5000,
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Okonomiyaki_001.jpg/1200px-Okonomiyaki_001.jpg"
      },
      {
        name: "Ramen",
        description: "Ramen",
        price: 5000,
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyMccI2noNL01ahTZhML51yB4Avy_ZTCI58g&s"
      },
      {
        name: "Sushi",
        description: "Sushi",
        price: 5000,
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF-Y8LVx8N5H_w20GIX2m8wPK5pH3xmGIYeQ&s"
      }
    ]);
    console.log('Productos de prueba creados');

    // Iniciar tareas programadas
    initCronJobs();
    
    console.log('Inicialización completada');
    console.log('ID del usuario de prueba:', testUser.id);
    console.log('IDs de productos de prueba:', products.map(p => p.id));

    // Guardar los IDs en variables globales para fácil acceso
    global.testUserId = testUser.id;
    global.testProducts = products.map(p => p.id);
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    process.exit(1); // Salir si hay un error crítico
  }
};

// Inicializar la base de datos
initializeDatabase();

//PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Servidor en http://localhost:${PORT}`));
