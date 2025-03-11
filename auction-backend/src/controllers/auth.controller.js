const jwt = require("jsonwebtoken");

const dummyUsers = {
  admin1: { password: "admin2", role: "admin" },
  user1: { password: "user2", role: "regular" },
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  const user = dummyUsers[username];
  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ username, password, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token });
};
