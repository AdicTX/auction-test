import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
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
  Table,
  TableBody,
  Chip,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
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
    e.target.src = "/placeholder-item.png";
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
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

      <TableContainer component={Paper} sx={{ mt: 3, boxShadow: theme.shadows[3] }}>
        <Table sx={{ minWidth: 650 }} aria-label="items table">
          <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Image</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>End Date</TableCell>
              <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.id}
                hover
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                  <Avatar
                    variant="square"
                    src={item.image_url ? `${baseUrl}/${item.image_url}` : "/placeholder-item.png"}
                    alt={item.name}
                    sx={{
                      width: 80,
                      height: 60,
                      objectFit: "cover",
                      borderRadius: 1,
                    }}
                    onError={handleImageError}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body1" fontWeight={500}>
                    {item.name}
                  </Typography>
                </TableCell>
                <TableCell sx={{ maxWidth: 300 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {item.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={`$${item.current_price}`}
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {moment(item.end_time).format("MMM DD, YYYY")}
                  </Typography>
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                    <IconButton
                      component={Link}
                      to={`/admin/detail/${item.id}`}
                      color="primary"
                      size="small"
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton
                      component={Link}
                      to={`/admin/edit/${item.id}`}
                      color="secondary"
                      size="small"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteConfirmation(item)}
                      size="small"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
