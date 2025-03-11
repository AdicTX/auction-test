const jwt = require("jsonwebtoken");

const dummyUsers = {
  admin1: { password: "admin2", role: "admin" },
  user1: { password: "user2", role: "regular" },
};

const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) return res.status(401).send("Access denied");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = dummyUsers[decoded.username];

    if (!user || user.password !== decoded.password) {
      throw new Error("Invalid token");
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send("Invalid authentication");
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).send("Admin access required");
  next();
};

module.exports = { authenticate, isAdmin };
