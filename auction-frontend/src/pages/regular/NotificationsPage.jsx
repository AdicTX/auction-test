// src/pages/NotificationsPage.js
import React, { useEffect, useState } from "react";
import { Container, Typography, CircularProgress, Alert, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import NotificationList from "../../components/NotificationList";
import { getNotifications } from "../../services/notificationService";

const baseUrl = import.meta.env.VITE_API_URL;
const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (error) {
        setError("Error al cargar notificaciones");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const eventSource = new EventSource(`${baseUrl}/notifications/sse`);

    eventSource.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      setNotifications((prev) => [newNotification, ...prev]);
    };

    eventSource.onerror = () => {
      console.error("Error in SSE connection");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
        Notifications
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <NotificationList notifications={notifications} setNotifications={setNotifications} />

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate(-1)}
          sx={{ width: 200 }}
        >
          Back
        </Button>
      </Box>
    </Container>
  );
};

export default NotificationsPage;
