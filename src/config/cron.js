import cron from "node-cron";
import { Cart, CartItem } from "../models/cart.model.js";
import { Order, OrderItem } from "../models/order.model.js";
import Product from "../models/product.model.js";

// Función para procesar los carritos
const processWeeklyCarts = async () => {
  try {
    console.log("Iniciando procesamiento semanal de carritos...");
    
    const activeCarts = await Cart.findAll({
      where: { status: "active" },
      include: [{
        model: CartItem,
        include: [Product]
      }]
    });

    console.log(`Procesando ${activeCarts.length} carritos activos`);

    for (const cart of activeCarts) {
      try {
        // Calcular total
        let total = 0;
        const orderItems = [];

        for (const item of cart.CartItems) {
          total += item.Product.price * item.quantity;
          orderItems.push({
            productId: item.productId,
            quantity: item.quantity,
            price: item.Product.price
          });
        }

        // Crear orden
        const order = await Order.create({
          userId: cart.userId,
          total,
          status: "pending"
        });

        // Crear items de la orden
        await OrderItem.bulkCreate(orderItems.map(item => ({
          ...item,
          orderId: order.id
        })));

        // Marcar carrito como procesado
        cart.status = "processed";
        await cart.save();

        console.log(`Carrito ${cart.id} procesado exitosamente`);
      } catch (error) {
        console.error(`Error procesando carrito ${cart.id}:`, error);
      }
    }

    console.log("Procesamiento semanal de carritos completado");
  } catch (error) {
    console.error("Error en el procesamiento semanal de carritos:", error);
  }
};

// Programar la tarea para ejecutarse todos los domingos a las 23:59
// El formato es: minuto hora día-del-mes mes día-de-la-semana
export const initCronJobs = () => {
  cron.schedule("59 23 * * 0", processWeeklyCarts, {
    timezone: "America/Argentina/Buenos_Aires" // Ajusta esto a tu zona horaria
  });
  
  console.log("Tarea programada de procesamiento de carritos iniciada");
}; 