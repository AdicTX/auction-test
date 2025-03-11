module.exports = (sequelize, DataTypes) => {
  const AutoBid = sequelize.define(
    "AutoBid",
    {
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
          fields: ["user_id", "item_id"],
        },
      ],
    }
  );

  return AutoBid;
};
