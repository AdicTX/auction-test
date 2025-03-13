// server.js
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { conn } = require("./db.js");
const path = require("path");

const cors = require("cors");
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/notifications/sse", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.write(": Connection established\n\n");

  const sendNotification = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  req.app.set("sendNotification", sendNotification);

  req.on("close", () => {
    console.log("disconnected");
    res.end();
  });
});

const authRoutes = require("./routes/auth.route");
const adminRoutes = require("./routes/admin.route");
const bidRoutes = require("./routes/bid.route");
const itemRoutes = require("./routes/items.route");
const notificationRoutes = require("./routes/notification.route");
//server
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/bids", bidRoutes);
app.use("/items", itemRoutes);
app.use("/notifications", notificationRoutes);
conn
  .sync()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
