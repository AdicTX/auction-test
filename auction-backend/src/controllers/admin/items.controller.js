const { Item, conn } = require("../../db");
const { validationResult } = require("express-validator");
const fs = require("fs/promises");
const path = require("path");
// const asd = require("../../../uploads");

exports.createItem = async (req, res) => {
  const transaction = await conn.transaction();
  try {
    // Validación avanzada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, start_price, end_time } = req.body;
    const image = req.file ? req.file.path : null;

    // Validación de negocio
    if (new Date(end_time) <= new Date()) {
      if (req.file) await fs.unlink(req.file.path);
      return res.status(400).json({ error: "End time must be in the future" });
    }

    const newItem = await Item.create(
      {
        name: name.trim(),
        description: description?.trim(),
        start_price: parseFloat(start_price).toFixed(2),
        current_price: parseFloat(start_price).toFixed(2),
        end_time,
        image_url: image,
      },
      { transaction }
    );

    await transaction.commit();

    res.status(201).json({
      success: true,
      data: newItem,
      message: "Item created successfully",
    });
  } catch (error) {
    await transaction.rollback();
    if (req.file) await fs.unlink(req.file.path);

    console.error("Error creating item:", error);
    res.status(500).json({
      success: false,
      error: process.env.NODE_ENV === "development" ? error.message : "Server error",
    });
  }
};

exports.updateItem = async (req, res) => {
  const transaction = await conn.transaction();
  try {
    const item = await Item.findOne({
      where: { id: req.params.id },
      transaction,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        error: "Item not found",
      });
    }

    // Validación de actualización
    if (req.body.end_time && new Date(req.body.end_time) <= new Date()) {
      return res.status(400).json({
        success: false,
        error: "End time must be in the future",
      });
    }

    // Manejo de imagen
    let newImagePath = null;
    if (req.file) {
      newImagePath = req.file.path;
      if (item.image_url) {
        await fs.unlink(path.join(__dirname, "../../../", item.image_url));
      }
    }

    const updates = {
      ...req.body,
      ...(newImagePath && { image_url: newImagePath }),
      ...(req.body.start_price && {
        start_price: parseFloat(req.body.start_price).toFixed(2),
      }),
    };

    const updatedItem = await item.update(updates, { transaction });
    await transaction.commit();

    res.json({
      success: true,
      data: updatedItem,
      message: "Item updated successfully",
    });
  } catch (error) {
    await transaction.rollback();
    if (req.file) await fs.unlink(req.file.path);

    console.error("Error updating item:", error);
    res.status(500).json({
      success: false,
      error: process.env.NODE_ENV === "development" ? error.message : "Server error",
    });
  }
};

exports.deleteItem = async (req, res) => {
  const transaction = await conn.transaction();
  try {
    const item = await Item.findOne({
      where: { id: req.params.id },
      transaction,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        error: "Item not found",
      });
    }

    // Eliminar imagen asociada
    if (item.image_url) {
      await fs.unlink(path.join(__dirname, "../../../", item.image_url));
    }

    await item.destroy({ transaction });
    await transaction.commit();

    res.status(204).end();
  } catch (error) {
    await transaction.rollback();

    console.error("Error deleting item:", error);
    res.status(500).json({
      success: false,
      error: process.env.NODE_ENV === "development" ? error.message : "Server error",
    });
  }
};
