const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  return sequelize.define("UserAutoBidConfig", {
    user_id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    global_max: DataTypes.DECIMAL(10, 2),
    alert_percent: DataTypes.DECIMAL(5, 2),
    used_amount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
  });
};
