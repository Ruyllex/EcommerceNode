import Product from '../models/product.model.js';
import { Order, OrderItem } from '../models/order.model.js';
import { Cart } from '../models/cart.model.js';
import User from '../models/user.model.js';
import { Op } from 'sequelize';
import fs from 'fs';
import path from 'path';

// Cambiar el precio de un producto
export const changeProductPrice = async (req, res) => {
  const { productId } = req.params;
  const { newPrice } = req.body;

  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    product.price = newPrice;
    await product.save();

    res.status(200).json({ message: 'Precio actualizado', product });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el precio', error: error.message });
  }
};

// Alterar fechas
export const alterDates = async (req, res) => {
  const { newDate } = req.body;

  try {
    // Ejemplo: actualizar la fecha de todos los pedidos a una nueva fecha
    await Order.update({ createdAt: newDate }, { where: {} });
    await Cart.update({ weekOf: newDate }, { where: {} });

    res.status(200).json({ message: 'Fechas actualizadas' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar las fechas', error: error.message });
  }
};

// Exportar datos de la semana
export const exportWeeklyData = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });

    const filePath = path.join(__dirname, '../exports/weekly_data.json');
    fs.writeFileSync(filePath, JSON.stringify(orders, null, 2));

    res.download(filePath);
  } catch (error) {
    res.status(500).json({ message: 'Error al exportar los datos', error: error.message });
  }
}; 
// Obtener usuarios y sus IDs
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name'] // Seleccionar solo los campos id y name
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
  }
};