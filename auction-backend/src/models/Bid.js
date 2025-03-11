module.exports = (sequelize, DataTypes) => {
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

  Bid.associate = (models) => {
    Bid.belongsTo(models.Item, { foreignKey: "item_id" });
  };

  return Bid;
};
