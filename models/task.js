const { DataTypes } = require("sequelize");
const sequelize = require("../config");
const User = require("./user");

const Task = sequelize.define("Task", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  description: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.ENUM("Asignado", "En Progreso", "Hecho"), defaultValue: "Asignado" }
});

Task.belongsTo(User);
User.hasMany(Task);

module.exports = Task;
