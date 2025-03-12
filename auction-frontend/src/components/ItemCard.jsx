import React from "react";
import { Card, CardMedia, CardContent, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const ItemCard = ({ item }) => {
  return (
    <Card>
      <CardMedia
        component="img"
        height="200"
        image={item.image_url || "https://via.placeholder.com/300"}
        alt={item.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {item.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {item.description}
        </Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Current Price: ${item.current_price}
        </Typography>
        <Button
          component={Link}
          to={`/items/${item.id}`}
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
        >
          Bid Now
        </Button>
      </CardContent>
    </Card>
  );
};

export default ItemCard;
