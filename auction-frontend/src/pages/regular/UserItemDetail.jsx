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
  List,
  TextField,
  ListItem,
  ListItemText,
  ListItemAvatar,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import { ArrowBack, Event, MonetizationOn, Gavel, Person, Settings } from "@mui/icons-material";
import axiosInstance from "../../axiosInstance";
import moment from "moment";
import { styled } from "@mui/material/styles";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

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

const UserItemDetail = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [bidHistory, setBidHistory] = useState([]);
  const [autoBidConfig, setAutoBidConfig] = useState({
    active: false,
    hasConfig: false,
  });

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const [itemRes, bidsRes, autoBidRes] = await Promise.all([
          axiosInstance.get(`/items/${id}`),
          axiosInstance.get(`/bids/item/${id}`),
          axiosInstance.get(`/bids/auto-bid/status/${id}`),
        ]);
        console.log(autoBidRes.data);

        if (isMounted) {
          setItem(itemRes.data);
          setBidHistory(bidsRes.data);
          setAutoBidConfig({
            active: autoBidRes.data.active,
            hasConfig: autoBidRes.data.exists,
          });
          startCountdown(itemRes.data.end_time);
        }
      } catch (error) {
        toast.error("Error loading item data");
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const startCountdown = (endTime) => {
    const timer = setInterval(() => {
      const now = moment();
      const end = moment(endTime);
      const duration = moment.duration(end.diff(now));

      if (duration.asSeconds() <= 0) {
        clearInterval(timer);
        setTimeLeft("Auction ended");
        setItem((prev) => (prev ? { ...prev, status: "ended" } : null));
      } else {
        setTimeLeft(`${duration.days()}d ${duration.hours()}h ${duration.minutes()}m left`);
      }
    }, 1000);

    return () => clearInterval(timer);
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();

    if (!item || item.status === "ended") {
      toast.error("Auction has already ended");
      return;
    }

    const numericBid = parseFloat(bidAmount);
    if (isNaN(numericBid)) {
      toast.error("Please enter a valid bid amount");
      return;
    }

    if (numericBid <= item.current_price) {
      toast.error(`Bid must be higher than $${item.current_price}`);
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post(`/bids`, {
        item_id: id,
        amount: numericBid,
      });

      const [updatedItem, updatedBids] = await Promise.all([
        axiosInstance.get(`/items/${id}`),
        axiosInstance.get(`/bids/item/${id}`),
      ]);

      setItem(updatedItem.data);
      setBidHistory(updatedBids.data);
      setBidAmount("");
      toast.success("Bid placed successfully!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Error placing bid");
    } finally {
      setLoading(false);
    }
  };

  const toggleAutoBid = async () => {
    try {
      const newActiveState = !autoBidConfig.active;
      const response = await axiosInstance.put(`/bids/auto-bid/toggle/${id}`, {
        active: newActiveState,
      });

      setAutoBidConfig((prev) => ({
        active: newActiveState,
        hasConfig: true,
      }));

      toast.success(`Auto-bidding ${newActiveState ? "activated" : "deactivated"}`);
    } catch (error) {
      toast.error(error.response?.data?.error || "Error updating auto-bid");
      setAutoBidConfig((prev) => ({ ...prev, active: !prev.active }));
    }
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
      <ToastContainer position="bottom-right" />
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 4 }}>
        Back to list
      </Button>

      <Card elevation={3} sx={{ borderRadius: 4 }}>
        <Grid container>
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              height="500"
              image={`${baseUrl}/${item.image_url}`}
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
                <CountdownChip label={item.status === "ended" ? "Auction Ended" : timeLeft} />
              </Box>

              <Divider sx={{ my: 3 }} />

              <DetailItem
                icon={<MonetizationOn />}
                label="Starting Price"
                value={`$${item.start_price}`}
              />

              <DetailItem
                icon={<MonetizationOn color="success" />}
                label="Current Bid"
                value={`$${item.current_price}`}
              />

              <DetailItem
                icon={<Event color="secondary" />}
                label="Ends On"
                value={moment(item.end_time).format("DD/MM/YYYY HH:mm")}
              />

              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body1" paragraph sx={{ whiteSpace: "pre-line" }}>
                  {item.description || "No description available"}
                </Typography>
              </Box>

              <Divider sx={{ my: 4 }} />

              <Box component="form" onSubmit={handleBidSubmit} sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Place a Bid
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  label="Bid Amount"
                  variant="outlined"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  sx={{ mb: 2 }}
                  inputProps={{
                    min: item.current_price + 0.01,
                    step: 0.01,
                  }}
                  disabled={item.status === "ended"}
                />
                {loading && <LinearProgress sx={{ mb: 2 }} />}

                <Box sx={{ display: "flex", gap: 2, alignItems: "center", mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Gavel />}
                    size="large"
                    disabled={loading || item.status === "ended"}
                    sx={{ px: 4, flexShrink: 0 }}
                  >
                    {loading ? "Processing..." : "Place Bid"}
                  </Button>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Tooltip
                      title={!autoBidConfig.hasConfig ? "Configure auto-bid settings first" : ""}
                    >
                      <span>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={autoBidConfig.active}
                              onChange={toggleAutoBid}
                              disabled={!autoBidConfig.hasConfig || item.status === "ended"}
                              color="secondary"
                            />
                          }
                          label="Auto-Bidding"
                        />
                      </span>
                    </Tooltip>
                    <Button
                      component={Link}
                      to="/auto-bid-config"
                      variant="outlined"
                      startIcon={<Settings />}
                      size="small"
                    >
                      Configure
                    </Button>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom color="text.secondary">
                  Bid History
                </Typography>
                <List>
                  {bidHistory.map((bid) => (
                    <ListItem key={bid.id}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: bid.is_auto ? theme.palette.info.main : undefined }}>
                          {bid.is_auto ? <Settings /> : <Person />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`$${bid.amount} ${bid.is_auto ? "(Auto Bid)" : ""}`}
                        secondary={`${moment(bid.createdAt).format("DD/MM/YYYY HH:mm")} • ${
                          bid.user_id
                        }`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default UserItemDetail;
