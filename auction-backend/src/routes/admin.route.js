const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin/items.controller");
const { authenticate, isAdmin } = require("../middleware/auth");

router.post("/items", authenticate, isAdmin, adminController.createItem);
router.put("/items/:id", authenticate, isAdmin, adminController.updateItem);
router.delete("/items/:id", authenticate, isAdmin, adminController.deleteItem);

module.exports = router;
