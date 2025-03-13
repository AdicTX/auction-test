const { Notification } = require("../db");

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: {
        user_id: req.user.username,
        read: false,
      },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({
      error: "Error fetching notifications",
      details: error.message,
    });
  }
};

exports.markAsRead = async (req, res) => {
  const { notificationId } = req.body;

  try {
    await Notification.update(
      { read: true },
      {
        where: { id: notificationId },
      }
    );

    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({
      error: "Error marking notification as read",
      details: error.message,
    });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.count({
      where: {
        user_id: req.user.username,
        read: false,
      },
    });

    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({
      error: "Error fetching unread notifications count",
      details: error.message,
    });
  }
};
