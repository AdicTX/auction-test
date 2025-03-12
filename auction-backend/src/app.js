// server.js
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { conn } = require("./db.js");
const path = require("path");

// Middlewares

const cors = require("cors");
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
// Routes
const authRoutes = require("./routes/auth.route");
const adminRoutes = require("./routes/admin.route");
const bidRoutes = require("./routes/bid.route");
const itemRoutes = require("./routes/items.route");

//server
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/bids", bidRoutes);
app.use("/items", itemRoutes);

conn
  .sync()
  //   .sync({ alter: true })
  //   .sync({ force: true }) // Elimina y crea de nuevo las tablas (solo para desarrollo)
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
