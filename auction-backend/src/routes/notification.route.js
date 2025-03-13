const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notifications.controller");
const { authenticate } = require("../middleware/auth");

router.get("/", authenticate, notificationController.getNotifications);
router.get("/unread-count", authenticate, notificationController.getUnreadCount);

router.post("/mark-as-read", authenticate, notificationController.markAsRead);

module.exports = router;
