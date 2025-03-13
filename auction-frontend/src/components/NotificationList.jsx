// src/components/NotificationList.js
import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { CheckCircle, CircleNotifications } from "@mui/icons-material";
import { markAsRead } from "../services/notificationService";

const NotificationList = ({ notifications, setNotifications }) => {
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  return (
    <List>
      {notifications.map((notification) => (
        <ListItem
          key={notification.id}
          sx={{
            backgroundColor: notification.read ? "#f5f5f5" : "#e3f2fd",
            marginBottom: 1,
            borderRadius: 2,
          }}
        >
          <ListItemIcon>
            {notification.read ? (
              <CheckCircle color="primary" />
            ) : (
              <CircleNotifications color="secondary" />
            )}
          </ListItemIcon>
          <ListItemText
            primary={notification.message}
            secondary={new Date(notification.createdAt).toLocaleString()}
          />
          {!notification.read && (
            <IconButton onClick={() => handleMarkAsRead(notification.id)} color="primary">
              <CheckCircle />
            </IconButton>
          )}
        </ListItem>
      ))}
    </List>
  );
};

export default NotificationList;
