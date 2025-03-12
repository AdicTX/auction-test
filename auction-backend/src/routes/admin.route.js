const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin/items.controller");
const { authenticate, isAdmin } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post("/items", authenticate, isAdmin, upload.single("image"), adminController.createItem);
router.put("/items/:id", authenticate, isAdmin, upload.single("image"), adminController.updateItem);
router.delete(
  "/items/:id",
  authenticate,
  isAdmin,
  upload.single("image"),
  adminController.deleteItem
);

module.exports = router;
