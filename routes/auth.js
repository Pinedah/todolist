const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

const router = express.Router();

router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });
    res.json({ message: "Usuario registrado" });
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password)))
        return res.status(401).json({ message: "Credenciales inválidas" });

    const token = jwt.sign(
        { id: user.id, role: user.role, username: user.username }, // Include username in the payload
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
    res.json({ token });
});

// Ruta para registrar usuario y enviar el token
router.post("/signup", async (req, res) => {
    const { username, password } = req.body;

    try {

        const newUser = await User.create({ email, password });
        
        // Generar token JWT
        const token = jwt.sign({ id: newUser.id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Enviar el token como parte de la respuesta
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});


module.exports = router;
