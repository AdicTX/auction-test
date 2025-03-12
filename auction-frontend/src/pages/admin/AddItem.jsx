import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import { CloudUpload, Cancel, AddCircle } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const AddItem = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_price: "",
    end_time: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormData({ ...formData, image: file });
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null });
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.name) errors.push("Name is required");
    if (!formData.start_price || Number(formData.start_price) <= 0)
      errors.push("Valid starting price is required");
    if (!formData.end_time || new Date(formData.end_time) < new Date())
      errors.push("End time must be in the future");

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (errors.length > 0) {
      setSnackbar({
        open: true,
        message: errors.join(", "),
        severity: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("start_price", formData.start_price);
      data.append("end_time", formData.end_time);
      if (formData.image) data.append("image", formData.image);

      await axiosInstance.post("/admin/items", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSnackbar({
        open: true,
        message: "Item added successfully!",
        severity: "success",
      });
      setTimeout(() => navigate("/admin"), 1500);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Error adding item",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4, gap: 2 }}>
        <AddCircle color="primary" sx={{ fontSize: 40 }} />
        <Typography variant="h4" component="h1">
          Add New Auction Item
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Item Name"
              name="name"
              fullWidth
              required
              value={formData.name}
              onChange={handleChange}
              inputProps={{ maxLength: 100 }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
              inputProps={{ maxLength: 500 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Starting Price ($)"
              name="start_price"
              type="number"
              fullWidth
              required
              inputProps={{ min: 0.01, step: 0.01 }}
              value={formData.start_price}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Auction End Date & Time"
              name="end_time"
              type="datetime-local"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: new Date().toISOString().slice(0, 16) }}
              value={formData.end_time}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ border: 1, borderRadius: 1, borderColor: "divider", p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Item Image
              </Typography>

              {formData.image ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    src={URL.createObjectURL(formData.image)}
                    variant="rounded"
                    sx={{ width: 100, height: 100 }}
                  />
                  <Chip
                    label={formData.image.name}
                    onDelete={removeImage}
                    deleteIcon={<Cancel />}
                  />
                </Box>
              ) : (
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  fullWidth
                  sx={{ py: 2 }}
                >
                  Upload Image
                  <VisuallyHiddenInput type="file" accept="image/*" onChange={handleImageUpload} />
                </Button>
              )}
              <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                Recommended size: 800x600px (JPEG or PNG)
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/admin")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? "Saving..." : "Create Auction"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ width: "100%", alignItems: "center" }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddItem;
