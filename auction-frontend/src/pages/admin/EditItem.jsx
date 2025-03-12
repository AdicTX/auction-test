import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  CircularProgress,
  Card,
  CardMedia,
  Chip,
  Avatar,
  InputAdornment,
  Divider,
  Alert,
} from "@mui/material";
import axiosInstance from "../../axiosInstance";
import { Save, Cancel, CloudUpload, Delete } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import moment from "moment";

const baseUrl = import.meta.env.VITE_API_URL;

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

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_price: "",
    end_time: "",
    image: null,
    image_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axiosInstance.get(`/items/${id}`);
        setFormData({
          ...response.data,
          end_time: moment(response.data.end_time).format("YYYY-MM-DDTHH:mm"),
        });
      } catch (err) {
        setError("Failed to load item details");
      }
    };
    fetchItem();
  }, [id]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormData((prev) => ({ ...prev, image: file, image_url: URL.createObjectURL(file) }));
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null, image_url: "" }));
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.name.trim()) errors.push("Name is required");
    if (!formData.start_price || Number(formData.start_price) <= 0)
      errors.push("Valid starting price required");
    if (!formData.end_time || new Date(formData.end_time) < new Date())
      errors.push("End time must be in the future");

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (errors.length > 0) {
      setError(errors.join(", "));
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

      await axiosInstance.put(`/admin/items/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Item updated successfully!");
      setTimeout(() => navigate("/admin"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
          <Save fontSize="medium" />
        </Avatar>
        <Typography variant="h4" component="h1">
          Edit Auction Item
        </Typography>
      </Box>

      <Card elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Item Name"
                name="name"
                fullWidth
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                inputProps={{ maxLength: 500 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Starting Price"
                name="start_price"
                type="number"
                fullWidth
                required
                value={formData.start_price}
                onChange={(e) => setFormData({ ...formData, start_price: e.target.value })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  inputProps: { min: 0.01, step: 0.01 },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Auction End"
                name="end_time"
                type="datetime-local"
                fullWidth
                required
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: new Date().toISOString().slice(0, 16) }}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Item Image
              </Typography>

              {formData.image_url ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <CardMedia
                    component="img"
                    image={`${baseUrl}/${formData.image_url}`}
                    alt="Current item"
                    sx={{ width: 150, height: 150, borderRadius: 2 }}
                  />
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<CloudUpload />}
                      sx={{ mb: 1, height: "40px", width: "100%" }}
                    >
                      Change Image
                      <VisuallyHiddenInput
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={removeImage}
                      sx={{ ml: 1, height: "40px", width: "100%" }}
                    >
                      Remove
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  fullWidth
                  sx={{ py: 2 }}
                >
                  Upload New Image
                  <VisuallyHiddenInput type="file" accept="image/*" onChange={handleImageUpload} />
                </Button>
              )}
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<Cancel />}
                  onClick={() => navigate("/admin")}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>

        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 3 }}>
            {success}
          </Alert>
        )}
      </Card>
    </Container>
  );
};

export default EditItem;
