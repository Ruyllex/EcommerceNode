import { Sequelize } from 'sequelize';
import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import User from '../models/user.model.js';

describe('Order Model', () => {
  let sequelize;
  let user;
  let product;

  beforeAll(async () => {

    sequelize = new Sequelize('sqlite::memory:', { logging: false });


    await sequelize.sync();

    user = await User.create({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password',
    });

    // Crear un producto para agregar al pedido
    product = await Product.create({
      name: 'Test Product',
      price: 100,
      stock: 10,
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should create an order', async () => {
    const order = await Order.create({
      userId: user.id,
      status: 'pending',
      totalPrice: product.price,
    });

    expect(order).toHaveProperty('id');
    expect(order.status).toBe('pending');
    expect(order.totalPrice).toBe(product.price);
    expect(order.userId).toBe(user.id);
  });

  it('should associate an order with a user', async () => {
    const order = await Order.create({
      userId: user.id,
      status: 'pending',
      totalPrice: product.price,
    });

    const foundUser = await order.getUser(); 
    expect(foundUser.id).toBe(user.id);
  });

  it('should calculate total price correctly when adding multiple products', async () => {
    const order = await Order.create({
      userId: user.id,
      status: 'pending',
      totalPrice: product.price * 2,
    });

    const orderProducts = await order.getProducts(); 
    expect(order.totalPrice).toBe(product.price * 2); 
  });

  it('should throw an error when trying to create an order without required fields', async () => {
    try {
      await Order.create({});
    } catch (error) {
      expect(error).toHaveProperty('message');
      expect(error.message).toMatch(/notNull Violation/); 
    }
  });
});
