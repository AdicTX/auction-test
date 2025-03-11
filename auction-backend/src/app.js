const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const authRoutes = require("./routes/auth");
const itemRoutes = require("./routes/items");
const bidRoutes = require("./routes/bids");
const adminRoutes = require("./routes/admin");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/admin", adminRoutes);

// Database sync
sequelize.sync({ force: false }).then(() => {
  console.log("Database connected");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
