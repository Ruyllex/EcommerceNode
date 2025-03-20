import jwt from "jsonwebtoken";
import config from "../config/jwt.config.js";

export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "No se proporcionó un token" });

  jwt.verify(token.split(" ")[1], config.secret, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Token inválido" });

    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

export const isAdmin = (req, res, next) => {
  if (req.userRole !== "admin") return res.status(403).json({ message: "Acceso denegado" });
  next();
};
