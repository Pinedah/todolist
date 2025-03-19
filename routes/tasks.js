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
  const { status } = req.query;
  const where = req.user.role === "admin" ? {} : { UserId: req.user.id };
  if (status) where.status = status;

  const tasks = await Task.findAll({
    where,
    include: { model: User, attributes: ["username"] }, // Include username in the response
  });
  res.json(tasks);
});

router.post("/", authMiddleware, async (req, res) => {
  const { description } = req.body;
  const task = await Task.create({ description, UserId: req.user.id });
  res.json(task);
});

router.patch("/:id/status", authMiddleware, async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

  const statuses = ["Asignado", "En Progreso", "Hecho"];
  const currentIndex = statuses.indexOf(task.status);
  task.status = statuses[(currentIndex + 1) % statuses.length];
  await task.save();

  res.json(task);
});

module.exports = router;
