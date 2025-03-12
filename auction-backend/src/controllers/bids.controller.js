const { Bid, Item, AutoBid } = require("../db");
const sequelize = require("../db");

exports.createBid = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const item = await Item.findByPk(req.body.item_id, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (new Date() > item.end_time) {
      throw new Error("Auction has ended");
    }

    if (req.body.amount <= item.current_price) {
      throw new Error("Bid amount must be higher than current price");
    }

    const bid = await Bid.create(
      {
        item_id: req.body.item_id,
        user_id: req.user.username,
        amount: req.body.amount,
      },
      { transaction: t }
    );

    item.current_price = req.body.amount;
    await item.save({ transaction: t });

    // Auto-bidding logic
    const autoBidders = await AutoBid.findAll({
      where: { item_id: item.id },
      transaction: t,
    });

    for (const autoBid of autoBidders) {
      if (autoBid.user_id === req.user.username) continue;

      const newAmount = req.body.amount + 1;
      if (newAmount > autoBid.max_amount) continue;

      await Bid.create(
        {
          item_id: item.id,
          user_id: autoBid.user_id,
          amount: newAmount,
        },
        { transaction: t }
      );

      item.current_price = newAmount;
      await item.save({ transaction: t });
    }

    await t.commit();
    res.status(201).json(bid);
  } catch (error) {
    await t.rollback();
    res.status(400).json({ error: error.message });
  }
};

exports.getBidHistory = async (req, res) => {
  try {
    const bids = await Bid.findAll({
      where: { item_id: req.params.itemId },
      order: [["createdAt", "DESC"]],
    });
    res.json(bids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.setAutoBid = async (req, res) => {
  try {
    const [autoBid, created] = await AutoBid.upsert(
      {
        user_id: req.user.username,
        item_id: req.body.itemId,
        max_amount: req.body.maxAmount,
        alert_percent: req.body.alertPercent,
      },
      {
        returning: true,
      }
    );

    res.status(created ? 201 : 200).json(autoBid);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
