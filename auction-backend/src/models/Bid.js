const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Bid = sequelize.define("Bid", {
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Bid;
};
