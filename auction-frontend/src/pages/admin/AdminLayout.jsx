import { Outlet } from "react-router-dom";
import { Container, Typography, AppBar, Toolbar, Button } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

const AdminLayout = () => {
  const { logout } = useContext(AuthContext);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Panel
          </Typography>
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
