import { Order, OrderItem } from "../models/order.model.js";
import Product from "../models/product.model.js"; 
import { Op } from "sequelize"; 

//------------------------------- Crear una nueva orden
export const createOrder = async (req, res) => {
  const { userId, items } = req.body; 

  try {

    let total = 0;
    const orderItems = [];

    for (let item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(400).json({ message: `Producto con id ${item.productId} no encontrado` });
      }
      total += product.price * item.quantity;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
    }


    const newOrder = await Order.create({ userId, total, status: "pending" });


    await OrderItem.bulkCreate(orderItems.map(item => ({
      ...item,
      orderId: newOrder.id
    })));

    res.status(201).json({ message: "Orden creada con éxito", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Error al crear la orden", error: error.message });
  }
};

export const getOrders = async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.findAll({
      where: { userId },
      include: [{ model: OrderItem, include: [Product] }] // Incluir los productos de cada orden
    });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las órdenes", error: error.message });
  }
};


export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: "Estado de la orden actualizado", order });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el estado", error: error.message });
  }
};
