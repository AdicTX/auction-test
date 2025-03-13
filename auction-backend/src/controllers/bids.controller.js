const { Bid, Item, AutoBid, UserAutoBidConfig, Notification } = require("../db");
const { conn: sequelize } = require("../db");
const { Op } = require("sequelize");

exports.createBid = async (req, res) => {
  const t = await sequelize.transaction();
  const sendNotification = req.app.get("sendNotification");
  try {
    const item = await Item.findByPk(req.body.item_id, {
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (!item) {
      await t.rollback();
      return res.status(404).json({ error: "Item not found" });
    }

    if (new Date() > item.end_time) {
      await t.rollback();
      return res.status(400).json({ error: "The auction has ended" });
    }

    if (req.body.amount <= item.current_price) {
      await t.rollback();
      return res.status(400).json({
        error: `Bid must be higher than the current price ($${item.current_price})`,
      });
    }

    const manualBid = await Bid.create(
      {
        item_id: item.id,
        user_id: req.user.username,
        amount: req.body.amount,
        is_auto: false,
      },
      { transaction: t }
    );

    item.current_price = req.body.amount;
    await item.save({ transaction: t });

    const activeAutoBidders = await AutoBid.findAll({
      where: {
        item_id: item.id,
        active: true,
        user_id: { [Op.ne]: req.user.username },
      },
      transaction: t,
    });

    for (const autoBid of activeAutoBidders) {
      const userConfig = await UserAutoBidConfig.findByPk(autoBid.user_id, {
        lock: true,
        transaction: t,
      });

      if (!userConfig) {
        await AutoBid.update(
          { active: false },
          {
            where: { id: autoBid.id },
            transaction: t,
          }
        );
        continue;
      }

      const proposedBid = item.current_price + 1;

      const lastBid = await Bid.findOne({
        where: {
          user_id: autoBid.user_id,
          item_id: item.id,
        },
        order: [["amount", "DESC"]],
        transaction: t,
      });

      const lastBidAmount = lastBid ? lastBid.amount : 0;
      const amountToAdd = proposedBid - lastBidAmount;

      const availableBudget = userConfig.global_max - userConfig.used_amount;

      if (amountToAdd > availableBudget) {
        await AutoBid.update(
          { active: false },
          {
            where: { id: autoBid.id },
            transaction: t,
          }
        );

        await Notification.create(
          {
            user_id: autoBid.user_id,
            message: `Auto-bid deactivated for ${item.name} - Insufficient budget`,
            read: false,
          },
          { transaction: t }
        );

        const notificationBudget = {
          user_id: autoBid.user_id,
          message: `Auto-bid deactivated for ${item.name} - Insufficient budget`,
          read: false,
        };
        sendNotification(notificationBudget);

        continue;
      }

      await Bid.create(
        {
          item_id: item.id,
          user_id: autoBid.user_id,
          amount: proposedBid,
          is_auto: true,
        },
        { transaction: t }
      );

      item.current_price = proposedBid;
      await item.save({ transaction: t });

      userConfig.used_amount = parseFloat(userConfig.used_amount) + amountToAdd;
      await userConfig.save({ transaction: t });

      const usagePercent = (userConfig.used_amount / userConfig.global_max) * 100;
      if (usagePercent >= userConfig.alert_percent) {
        await Notification.create(
          {
            user_id: autoBid.user_id,
            message: `Alert: You have used ${usagePercent.toFixed(2)}% of your budget`,
            read: false,
          },
          { transaction: t }
        );

        const notificationAlert = {
          user_id: autoBid.user_id,
          message: `Alert: You have used ${usagePercent.toFixed(2)}% of your budget`,
          read: false,
        };
        sendNotification(notificationAlert);
      }
    }

    await t.commit();
    res.status(201).json({
      ...manualBid.toJSON(),
      new_price: item.current_price,
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      error: "Error processing the bid",
      details: error.message,
    });
  }
};

exports.getBidHistory = async (req, res) => {
  try {
    const bids = await Bid.findAll({
      where: { item_id: req.params.itemId },
      order: [["amount", "DESC"]],
    });
    res.json(bids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.toggleAutoBid = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const userConfig = await UserAutoBidConfig.findByPk(req.user.username, {
      lock: true,
      transaction: t,
    });

    const item = await Item.findByPk(req.params.itemId, { transaction: t });

    if (req.body.active) {
      const minRequired = item.current_price + 1;
      const available = userConfig.global_max - userConfig.used_amount;

      if (available < minRequired) {
        throw new Error(`At least $${minRequired} is required (Available: $${available})`);
      }
    }

    const [autoBid] = await AutoBid.upsert(
      {
        user_id: req.user.username,
        item_id: req.params.itemId,
        active: req.body.active,
      },
      { transaction: t }
    );

    await t.commit();
    res.json(autoBid);
  } catch (error) {
    await t.rollback();
    res.status(400).json({ error: error.message });
  }
};

exports.getGlobalConfig = async (req, res) => {
  try {
    const [config] = await UserAutoBidConfig.findOrCreate({
      where: { user_id: req.user.username },
      defaults: {
        global_max: 0,
        alert_percent: 90,
        used_amount: 0,
      },
    });
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateGlobalConfig = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const [userConfig, created] = await UserAutoBidConfig.findOrCreate({
      where: { user_id: req.user.username },
      defaults: {
        global_max: 0,
        alert_percent: 90,
        used_amount: 0,
      },
      transaction: t,
      lock: true,
    });

    if (req.body.global_max < userConfig.used_amount) {
      throw new Error(
        `Budget ($${req.body.global_max}) cannot be less than the currently used amount ($${userConfig.used_amount})`
      );
    }

    const updatedConfig = await userConfig.update(
      {
        global_max: req.body.global_max,
        alert_percent: req.body.alert_percent,
      },
      { transaction: t }
    );

    await t.commit();

    res.status(created ? 201 : 200).json(updatedConfig);
  } catch (error) {
    await t.rollback();
    res.status(400).json({
      error: error.message,
      details: "Failed to update global configuration",
    });
  }
};

exports.getUsage = async (req, res) => {
  try {
    const config = await UserAutoBidConfig.findByPk(req.user.username);
    if (!config) return res.json({ used: 0, available: 0, percent: 0 });

    const response = {
      used: config.used_amount,
      available: config.global_max - config.used_amount,
      percent: config.global_max > 0 ? (config.used_amount / config.global_max) * 100 : 0,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAutoBidStatus = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { username } = req.user;

    const [autoBid, userConfig] = await Promise.all([
      AutoBid.findOne({ where: { item_id: itemId, user_id: username } }),
      UserAutoBidConfig.findOne({ where: { user_id: username } }),
    ]);

    if (!autoBid) {
      return res.json({ active: false, exists: !!userConfig });
    }

    res.json({ active: !!autoBid.active, exists: !!userConfig });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
