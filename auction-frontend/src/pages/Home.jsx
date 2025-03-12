import React, { useState, useEffect } from "react";
import { Container, Grid, TextField, Pagination, Typography } from "@mui/material";
import axiosInstance from "../axiosInstance";
import ItemCard from "../components/ItemCard";

const Home = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch items from the backend
  const fetchItems = async () => {
    try {
      const response = await axiosInstance.get("/api/items", {
        params: {
          page,
          search: searchTerm,
        },
      });
      setItems(response.data.items);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // Fetch items when the page or search term changes
  useEffect(() => {
    fetchItems();
  }, [page, searchTerm]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Available Items
      </Typography>

      {/* Search Bar */}
      <TextField
        label="Search items"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 4 }}
      />

      {/* Item List */}
      <Grid container spacing={4}>
        {items.map((item) => (
          <Grid item key={item.id} xs={12} sm={6} md={4}>
            <ItemCard item={item} />
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Pagination
        count={totalPages}
        page={page}
        onChange={(event, value) => setPage(value)}
        sx={{ mt: 4, display: "flex", justifyContent: "center" }}
      />
    </Container>
  );
};

export default Home;
