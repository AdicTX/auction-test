module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define("Item", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    start_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    current_price: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    start_time: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    image_url: DataTypes.STRING,
  });

  Item.associate = (models) => {
    Item.hasMany(models.Bid, { foreignKey: "item_id" });
    Item.hasMany(models.AutoBid, { foreignKey: "item_id" });
  };

  return Item;
};
