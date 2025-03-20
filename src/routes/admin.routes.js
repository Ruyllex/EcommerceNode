import express from 'express';
import { changeProductPrice, alterDates, exportWeeklyData, getUsers } from '../controllers/admin.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Cambiar el precio de un producto
router.put('/products/:productId/price', verifyToken, isAdmin, changeProductPrice);

// Alterar fechas
router.put('/dates', verifyToken, isAdmin, alterDates);

// Exportar datos de la semana
router.get('/export/weekly-data', verifyToken, isAdmin, exportWeeklyData);

// Obtener usuarios y sus IDs
router.get('/users', verifyToken, isAdmin, getUsers);



export default router;