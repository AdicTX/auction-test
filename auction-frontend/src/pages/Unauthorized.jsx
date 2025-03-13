import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        403 - Unauthorized Access
      </Typography>
      <Typography variant="body1" paragraph>
        You do not have permission to access this page
      </Typography>
      <Button variant="contained" component={Link} to="/">
        Back to Home
      </Button>
    </div>
  );
};

export default Unauthorized;
