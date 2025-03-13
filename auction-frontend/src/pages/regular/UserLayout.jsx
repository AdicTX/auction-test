import { Outlet, useNavigate } from "react-router-dom";
import { Container, Typography, AppBar, Toolbar, Button, Badge, IconButton } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";

const baseUrl = import.meta.env.VITE_API_URL;
const AdminLayout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        const response = await axiosInstance.get("/notifications/unread-count");
        setUnreadCount(response.data.count);
      } catch (error) {
        console.error("Error fetching unread notifications:", error);
      }
    };

    fetchUnreadNotifications();
  }, []);

  useEffect(() => {
    const eventSource = new EventSource(`${baseUrl}/notifications/sse`);

    eventSource.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      if (!newNotification.read) {
        setUnreadCount((prev) => prev + 1);
      }
    };

    eventSource.onerror = () => {
      console.error("Error en la conexión SSE");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleNotificationsClick = () => {
    navigate("/notifications");
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            User Panel
          </Typography>

          <IconButton color="inherit" onClick={handleNotificationsClick}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Outlet />
      </Container>
    </>
  );
};

export default AdminLayout;
