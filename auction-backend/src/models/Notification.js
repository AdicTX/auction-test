const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  return sequelize.define("Notification", {
    user_id: DataTypes.STRING,
    message: DataTypes.TEXT,
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
};
