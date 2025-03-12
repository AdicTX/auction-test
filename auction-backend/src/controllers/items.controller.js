const { Item, Bid } = require("../db");
const { Op } = require("sequelize");

exports.getAllItems = async (req, res) => {
  try {
    const { page = 1, search, sort } = req.query;
    const limit = 10;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    const order = [];
    if (sort === "price_asc") order.push(["current_price", "ASC"]);
    if (sort === "price_desc") order.push(["current_price", "DESC"]);

    const { count, rows } = await Item.findAndCountAll({
      where,
      order,
      limit,
      offset,
    });

    res.json({
      items: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id, {
      include: [{ model: Bid, as: "Bids", order: [["createdAt", "DESC"]] }],
    });

    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
