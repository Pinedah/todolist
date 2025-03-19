const express = require("express");
const cors = require("cors");
const sequelize = require("./config");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

sequelize.sync({ force: false }).then(() => console.log("DB sincronizada"));

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));
