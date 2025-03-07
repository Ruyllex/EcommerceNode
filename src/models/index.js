const sequelize = require("../config/database");

const User = require("./user.model");
const Product = require("./product.model");
const Category = require("./category.model");
const Size = require("./size.model");
const Stock = require("./stock.model");
const Cart = require("./cart.model");
const Order = require("./order.model");
const OrderDetail = require("./orderDetail.model");
const Payment = require("./payment.model");

// Relaciones
Product.belongsTo(Category, { foreignKey: "categoryId" });
Stock.belongsTo(Product, { foreignKey: "productId" });
Stock.belongsTo(Size, { foreignKey: "sizeId" });
Cart.belongsTo(User, { foreignKey: "userId" });
Cart.belongsTo(Product, { foreignKey: "productId" });
Order.belongsTo(User, { foreignKey: "userId" });
OrderDetail.belongsTo(Order, { foreignKey: "orderId" });
Payment.belongsTo(Order, { foreignKey: "orderId" });

sequelize.sync({ force: false }).then(() => console.log("DB Synced"));

module.exports = { User, Product, Category, Size, Stock, Cart, Order, OrderDetail, Payment };
