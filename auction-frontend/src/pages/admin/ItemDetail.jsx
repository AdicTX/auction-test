import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Divider,
  Skeleton,
  useTheme,
  Avatar,
  Stack,
} from "@mui/material";
import { Edit, ArrowBack, Event, MonetizationOn, Schedule } from "@mui/icons-material";
import axiosInstance from "../../axiosInstance";
import moment from "moment";
import { styled } from "@mui/material/styles";

const baseUrl = import.meta.env.VITE_API_URL;

const CountdownChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.warning.light,
  color: theme.palette.warning.contrastText,
  fontSize: "1.1rem",
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
}));

const DetailItem = ({ icon, label, value }) => (
  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
    <Avatar sx={{ bgcolor: "action.hover", width: 40, height: 40 }}>{icon}</Avatar>
    <Box>
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h6">{value}</Typography>
    </Box>
  </Stack>
);

const ItemDetail = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axiosInstance.get(`/items/${id}`);
        setItem(response.data);
        startCountdown(response.data.end_time);
      } catch (error) {
        console.error("Error fetching item:", error);
      }
    };

    fetchItem();
  }, [id]);

  const startCountdown = (endTime) => {
    const timer = setInterval(() => {
      const now = moment();
      const end = moment(endTime);
      const duration = moment.duration(end.diff(now));

      if (duration.asSeconds() <= 0) {
        clearInterval(timer);
        setTimeLeft("Auction ended");
      } else {
        setTimeLeft(`${duration.days()}d ${duration.hours()}h ${duration.minutes()}m left`);
      }
    }, 1000);

    return () => clearInterval(timer);
  };

  if (!item) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" width={200} height={40} sx={{ mb: 3 }} />
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" width="60%" height={40} />
            <Skeleton variant="text" width="80%" height={25} />
            <Skeleton variant="text" width="80%" height={25} />
            <Skeleton variant="text" width="80%" height={25} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate("/admin")} sx={{ mb: 4 }}>
        Back to List
      </Button>

      <Card elevation={3} sx={{ borderRadius: 4 }}>
        <Grid container>
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              height="500"
              image={`${baseUrl}/${item.image_url}` || "/placeholder-item.jpg"}
              alt={item.name}
              sx={{
                objectFit: "cover",
                borderTopLeftRadius: 16,
                borderBottomLeftRadius: { md: 16 },
                borderTopRightRadius: { xs: 16, md: 0 },
              }}
              onError={(e) => {
                e.target.src = "/placeholder-item.jpg";
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                  {item.name}
                </Typography>
                <CountdownChip icon={<Schedule sx={{ mr: 1 }} />} label={timeLeft} />
              </Box>

              <Divider sx={{ my: 3 }} />

              <DetailItem
                icon={<MonetizationOn />}
                label="Starting Price"
                value={`$${item.start_price}`}
              />

              <DetailItem
                icon={<MonetizationOn color="success" />}
                label="Current Price"
                value={`$${item.current_price}`}
              />

              <DetailItem
                icon={<Event color="secondary" />}
                label="Auction Ends"
                value={moment(item.end_time).format("MMM Do YYYY, h:mm a")}
              />

              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body1" paragraph sx={{ whiteSpace: "pre-line" }}>
                  {item.description || "No description available"}
                </Typography>
              </Box>

              <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={() => navigate(`/admin/edit/${id}`)}
                  size="large"
                  sx={{ px: 4 }}
                >
                  Edit Item
                </Button>
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default ItemDetail;
