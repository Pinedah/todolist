const express = require("express");
const jwt = require("jsonwebtoken");
const Task = require("../models/task");
const User = require("../models/user");

const router = express.Router();

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "Token requerido" });

  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token inválido" });
    req.user = decoded;
    next();
  });
};

router.get("/", authMiddleware, async (req, res) => {
  const tasks = req.user.role === "admin" ? await Task.findAll({ include: User }) : await Task.findAll({ where: { UserId: req.user.id } });
  res.json(tasks);
});

router.post("/", authMiddleware, async (req, res) => {
  const { description } = req.body;
  const task = await Task.create({ description, UserId: req.user.id });
  res.json(task);
});

module.exports = router;
