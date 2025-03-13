// src/services/notificationService.js
import axiosInstance from "../axiosInstance";

export const getNotifications = async () => {
  const response = await axiosInstance.get("/notifications");
  return response.data;
};

export const markAsRead = async (notificationId) => {
  const response = await axiosInstance.post("/notifications/mark-as-read", {
    notificationId,
  });
  return response.data;
};
