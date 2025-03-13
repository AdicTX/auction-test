const jwt = require("jsonwebtoken");

const dummyUsers = {
  admin1: { password: "password1", role: "admin" },
  admin2: { password: "password2", role: "admin" },
  user1: { password: "password1", role: "regular" },
  user2: { password: "password2", role: "regular" },
  user3: { password: "password3", role: "regular" },
};

const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = dummyUsers[decoded.username];

    if (!user) {
      return res.status(401).json({ error: "Invalid token." });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ error: "Invalid or expired token." });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required." });
  }
  next();
};

module.exports = { authenticate, isAdmin };
