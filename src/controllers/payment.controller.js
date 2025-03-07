import Stripe from 'stripe';
import Order from '../models/order.model.js';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export const processPayment = async (req, res) => {
  const { orderId, paymentMethodId } = req.body;

  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.total * 100, // El monto debe ser en centavos
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
    });

    order.status = 'paid';
    await order.save();

    res.status(200).json({
      message: 'Pago procesado con éxito',
      paymentIntent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al procesar el pago", error: error.message });
  }
};
