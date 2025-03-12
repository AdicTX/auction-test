// models/AutoBid.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const AutoBid = sequelize.define(
    "AutoBid",
    {
      user_id: {
        // Asegúrate de que esta columna esté definida
        type: DataTypes.STRING,
        allowNull: false,
      },
      item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      max_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      alert_percent: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 90,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["user_id", "item_id"], // Índice compuesto
        },
      ],
    }
  );

  return AutoBid;
};
