import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Grid,
  Pagination,
  TextField,
  Typography,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Edit, Visibility, Add, Delete } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import moment from "moment";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

const baseUrl = import.meta.env.VITE_API_URL;

const ItemList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [page, searchTerm]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/items", {
        params: { page, search: searchTerm },
      });
      setItems(response.data.items);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error("Error loading items");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirmation = (item) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await axiosInstance.delete(`/admin/items/${selectedItem.id}`);
      toast.success("Item deleted successfully");
      fetchItems();
    } catch (error) {
      toast.error("Error deleting item");
    } finally {
      setDeleteLoading(false);
      setOpenDialog(false);
    }
  };

  const handleImageError = (e) => {
    e.target.src = "/placeholder-item.jpg";
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Delete Confirmation Dialog */}
      <ToastContainer />
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Delete Item</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{selectedItem?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={deleteLoading}>
            {deleteLoading ? <CircularProgress size={24} /> : "Confirm Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 700,
            fontSize: { xs: "1.5rem", sm: "2rem" },
          }}
        >
          Auction Items
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            width: { xs: "100%", sm: "auto" },
            flexGrow: 1,
            maxWidth: 600,
          }}
        >
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search items..."
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 50,
                backgroundColor: theme.palette.background.paper,
              },
            }}
          />
          <Button
            variant="contained"
            startIcon={<Add />}
            component={Link}
            to="/admin/add"
            sx={{
              borderRadius: 50,
              px: 4,
              textTransform: "none",
              boxShadow: theme.shadows[3],
              whiteSpace: "nowrap",
            }}
          >
            New Item
          </Button>
        </Box>
      </Box>

      {/* Items Grid */}
      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "0.3s",
                boxShadow: theme.shadows[3],
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: theme.shadows[6],
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={item.image_url ? `${baseUrl}/${item.image_url}` : "/placeholder-item.png"}
                alt={item.name}
                sx={{
                  objectFit: "cover",
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }}
                onError={handleImageError}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {item.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {item.description}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 1,
                    mb: 2,
                  }}
                >
                  <Chip
                    label={`$${item.current_price}`}
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontStyle: "italic",
                    }}
                  >
                    {moment(item.end_time).format("MMM DD, YYYY")}
                  </Typography>
                </Box>
              </CardContent>
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  gap: 1,
                  justifyContent: "space-between",
                  borderTop: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Visibility />}
                    component={Link}
                    to={`/admin/detail/${item.id}`}
                    size="small"
                    sx={{ borderRadius: 50 }}
                  >
                    View
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    component={Link}
                    to={`/admin/edit/${item.id}`}
                    size="small"
                    sx={{ borderRadius: 50 }}
                  >
                    Edit
                  </Button>
                </Box>
                <IconButton
                  color="error"
                  onClick={() => handleDeleteConfirmation(item)}
                  size="small"
                  sx={{ ml: 1 }}
                >
                  <Delete />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: 4,
                fontWeight: 600,
              },
            }}
          />
        </Box>
      )}
    </Container>
  );
};

export default ItemList;
