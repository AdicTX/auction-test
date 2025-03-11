const { Item } = require("../../models");

exports.createItem = async (req, res) => {
  try {
    const item = await Item.create({
      ...req.body,
      current_price: req.body.start_price,
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    await item.update(req.body);
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    await item.destroy();
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
