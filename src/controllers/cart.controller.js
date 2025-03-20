import { Cart, CartItem } from "../models/cart.model.js";
import Product from "../models/product.model.js";
import { Order, OrderItem } from "../models/order.model.js";
import User from "../models/user.model.js";
import { startOfWeek, format } from "date-fns";
import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Obtener o crear el carrito de un usuario
export const getOrCreateCart = async (req, res) => {
  const { userId } = req.params;

  try {
    // Obtener el inicio de la semana actual
    const weekStart = startOfWeek(new Date());
    const formattedDate = format(weekStart, 'yyyy-MM-dd');

    console.log('Buscando carrito para la semana:', formattedDate);

    // Buscar carrito activo del usuario para la semana actual
    let cart = await Cart.findOne({
      where: {
        userId,
        status: "active",
        weekOf: formattedDate
      },
      include: [{
        model: CartItem,
        include: [Product]
      }]
    });

    // Si no existe, crear uno nuevo
    if (!cart) {
      console.log('Creando nuevo carrito para:', userId, 'semana:', formattedDate);
      cart = await Cart.create({
        userId,
        weekOf: formattedDate,
        status: "active"
      });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error en getOrCreateCart:", error);
    res.status(500).json({ message: "Error al obtener el carrito", error: error.message });
  }
};

// Añadir item al carrito
export const addToCart = async (req, res) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body;

  try {
    // Obtener el inicio de la semana actual
    const weekStart = startOfWeek(new Date());
    const formattedDate = format(weekStart, 'yyyy-MM-dd');

    console.log('Buscando/creando carrito para la semana:', formattedDate);

    // Obtener o crear el carrito
    let cart = await Cart.findOne({
      where: {
        userId,
        status: "active",
        weekOf: formattedDate
      }
    });

    if (!cart) {
      console.log('Creando nuevo carrito para:', userId);
      cart = await Cart.create({
        userId,
        weekOf: formattedDate,
        status: "active"
      });
    }

    // Verificar si el producto ya está en el carrito
    let cartItem = await CartItem.findOne({
      where: {
        cartId: cart.id,
        productId
      }
    });

    if (cartItem) {
      // Actualizar cantidad si ya existe
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      // Crear nuevo item si no existe
      cartItem = await CartItem.create({
        cartId: cart.id,
        productId,
        quantity
      });
    }

    // Obtener el carrito actualizado con todos sus items
    const updatedCart = await Cart.findByPk(cart.id, {
      include: [{
        model: CartItem,
        include: [Product]
      }]
    });

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error("Error en addToCart:", error);
    res.status(500).json({ message: "Error al añadir al carrito", error: error.message });
  }
};

// Actualizar cantidad de un item en el carrito
export const updateCartItem = async (req, res) => {
  const { cartItemId } = req.params;
  const { quantity } = req.body;

  try {
    const cartItem = await CartItem.findByPk(cartItemId);
    if (!cartItem) {
      return res.status(404).json({ message: "Item no encontrado" });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    // Obtener el carrito actualizado
    const updatedCart = await Cart.findByPk(cartItem.cartId, {
      include: [{
        model: CartItem,
        include: [Product]
      }]
    });

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error("Error en updateCartItem:", error);
    res.status(500).json({ message: "Error al actualizar cantidad", error: error.message });
  }
};

// Eliminar item del carrito
export const removeFromCart = async (req, res) => {
  const { cartItemId } = req.params;

  try {
    const cartItem = await CartItem.findByPk(cartItemId);
    if (!cartItem) {
      return res.status(404).json({ message: "Item no encontrado" });
    }

    const cartId = cartItem.cartId;
    await cartItem.destroy();

    // Obtener el carrito actualizado
    const updatedCart = await Cart.findByPk(cartId, {
      include: [{
        model: CartItem,
        include: [Product]
      }]
    });

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error("Error en removeFromCart:", error);
    res.status(500).json({ message: "Error al eliminar item", error: error.message });
  }
};

// Ver todos los carritos activos (solo admin)
export const getAllActiveCarts = async (req, res) => {
  try {
    const carts = await Cart.findAll({
      where: { status: "active" },
      include: [{
        model: CartItem,
        include: [Product]
      }]
    });

    res.status(200).json(carts);
  } catch (error) {
    console.error("Error en getAllActiveCarts:", error);
    res.status(500).json({ message: "Error al obtener carritos", error: error.message });
  }
};

// Obtener carritos de un usuario específico
export const getUserCarts = async (req, res) => {
  const { userId } = req.params;

  try {
    const carts = await Cart.findAll({
      where: { userId },
      include: [{
        model: CartItem,
        include: [Product]
      }]
    });

    if (carts.length === 0) {
      return res.status(404).json({ message: 'No se encontraron carritos para este usuario' });
    }

    res.json(carts);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los carritos', error: error.message });
  }
};

// Procesar todos los carritos activos y convertirlos en órdenes
export const processWeeklyOrders = async (req, res) => {
  try {
    const activeCarts = await Cart.findAll({
      where: { status: "active" },
      include: [{
        model: CartItem,
        include: [Product]
      }]
    });

    console.log(`Procesando ${activeCarts.length} carritos activos`);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Pedidos Semanales');

    // Agregar encabezados
    worksheet.columns = [
      { header: 'Usuario', key: 'user', width: 30 },
      { header: 'Lunes', key: 'monday', width: 10 },
      { header: 'Martes', key: 'tuesday', width: 10 },
      { header: 'Miércoles', key: 'wednesday', width: 10 },
      { header: 'Jueves', key: 'thursday', width: 10 },
      { header: 'Viernes', key: 'friday', width: 10 },
    ];

    // Mapeo de productId a días de la semana
    const dayMap = {
      1: 'monday',  // productId = 1 → Lunes
      2: 'tuesday', // productId = 2 → Martes
      3: 'wednesday', // productId = 3 → Miércoles
      4: 'thursday', // productId = 4 → Jueves
      5: 'friday', // productId = 5 → Viernes
    };

    // Iterar sobre los carritos activos
    for (const cart of activeCarts) {
      try {
        let total = 0;
        const orderItems = [];

        // Iterar sobre los items del carrito y calcular el total
        for (const item of cart.CartItems) {
          total += item.Product.price * item.quantity;
          orderItems.push({
            productId: item.productId,
            quantity: item.quantity,
            price: item.Product.price
          });
        }

        // Crear la orden
        const order = await Order.create({
          userId: cart.userId,
          total,
          status: "pending"
        });

        // Crear los items de la orden
        await OrderItem.bulkCreate(orderItems.map(item => ({
          ...item,
          orderId: order.id
        })));

        // Marcar el carrito como procesado
        cart.status = "processed";
        await cart.save();

        console.log(`Carrito ${cart.id} procesado exitosamente`);

        // Agregar datos al Excel
        const user = await User.findByPk(cart.userId);
        const row = {
          user: user.name,
          monday: 0,
          tuesday: 0,
          wednesday: 0,
          thursday: 0,
          friday: 0,
          saturday: 0,
          sunday: 0
        };
        for (const item of cart.CartItems) {
          const dayOfWeek = dayMap[item.productId];  // Usar el productId para obtener el día de la semana
          if (dayOfWeek) {
            row[dayOfWeek] += item.quantity; // Asignar la cantidad del producto al día correspondiente
          } else {
            console.error(`Product ID ${item.productId} no corresponde a un día válido`);
          }
        }

        // Agregar la fila al Excel
        worksheet.addRow(row);

      } catch (error) {
        console.error(`Error procesando carrito ${cart.id}:`, error);
      }
    }

    // Crear el directorio si no existe
    const exportsDir = path.join(__dirname, '../exports');
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    // Guardar el archivo Excel
    const filePath = path.join(exportsDir, 'pedidos_semanales.xlsx');
    await workbook.xlsx.writeFile(filePath);

    res.download(filePath, 'pedidos_semanales.xlsx', (err) => {
      if (err) {
        console.error("Error al enviar el archivo:", err);
        res.status(500).json({ message: "Error al enviar el archivo", error: err.message });
      } else {
        console.log("Archivo enviado exitosamente");
      }
    });
  } catch (error) {
    console.error("Error en processWeeklyOrders:", error);
    res.status(500).json({ message: "Error al procesar carritos", error: error.message });
  }
};
