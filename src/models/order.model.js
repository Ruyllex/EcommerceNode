import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.model.js"; // Relación con User
import Product from "./product.model.js"; // Relación con Product

const Order = sequelize.define("Order", {
  id: { 
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4, 
    primaryKey: true 
  },
  userId: { 
    type: DataTypes.UUID, 
    allowNull: false, 
    references: { model: User, key: "id" } 
  },
  total: { 
    type: DataTypes.FLOAT, 
    allowNull: false 
  },
  status: { 
    type: DataTypes.ENUM("pending", "paid", "shipped", "completed", "cancelled"), 
    defaultValue: "pending" 
  },
});

const OrderItem = sequelize.define("OrderItem", {
  id: { 
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4, 
    primaryKey: true 
  },
  orderId: { 
    type: DataTypes.UUID, 
    allowNull: false, 
    references: { model: Order, key: "id" } 
  },
  productId: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    references: { model: Product, key: "id" } 
  },
  quantity: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  price: { 
    type: DataTypes.FLOAT, 
    allowNull: false 
  }
});

// Definir relaciones
Order.belongsTo(User, { foreignKey: "userId" });
Order.hasMany(OrderItem, { foreignKey: "orderId" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });
OrderItem.belongsTo(Product, { foreignKey: "productId" });

export { Order, OrderItem };
