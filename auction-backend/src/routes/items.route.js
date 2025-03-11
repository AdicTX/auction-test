const express = require("express");
const router = express.Router();
const itemsController = require("../controllers/items.controller");
const { authenticate } = require("../middleware/auth");

router.get("/", authenticate, itemsController.getAllItems);
router.get("/:id", authenticate, itemsController.getItemById);

module.exports = router;
