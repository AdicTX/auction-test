const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("AutoBid", {
    user_id: DataTypes.STRING,
    item_id: DataTypes.INTEGER,
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
};
