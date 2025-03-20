import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./user.model.js";
import Product from "./product.model.js";

const Cart = sequelize.define("Cart", {
  id: { 
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4, 
    primaryKey: true
  },
  userId: { 
    type: DataTypes.UUID, 
    allowNull: false,
    references: { 
      model: User, 
      key: "id" 
    }
  },
  weekOf: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM("active", "processed"),
    defaultValue: "active"
  }
}, {
  tableName: 'Carts',
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'status', 'week_of'],
      where: {
        status: 'active'
      },
      name: 'unique_active_cart_per_week'
    }
  ]
});

const CartItem = sequelize.define("CartItem", {
  id: { 
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4, 
    primaryKey: true
  },
  cartId: { 
    type: DataTypes.UUID, 
    allowNull: false,
    references: { 
      model: Cart, 
      key: "id" 
    }
  },
  productId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: { 
      model: Product, 
      key: "id" 
    }
  },
  quantity: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    defaultValue: 1
  }
}, {
  tableName: 'CartItems',
  underscored: true,
  indexes: [
    {
      fields: ['cart_id', 'product_id'],
      unique: true,
      name: 'unique_product_per_cart'
    }
  ]
});

// Definir relaciones
Cart.belongsTo(User, { 
  foreignKey: "user_id",
  onDelete: 'CASCADE'
});

User.hasMany(Cart, { 
  foreignKey: "user_id",
  onDelete: 'CASCADE'
});

Cart.hasMany(CartItem, { 
  foreignKey: "cart_id",
  onDelete: 'CASCADE'
});

CartItem.belongsTo(Cart, { 
  foreignKey: "cart_id",
  onDelete: 'CASCADE'
});

CartItem.belongsTo(Product, { 
  foreignKey: "product_id",
  onDelete: 'NO ACTION'
});

export { Cart, CartItem };

