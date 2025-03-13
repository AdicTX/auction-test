const jwt = require("jsonwebtoken");

const dummyUsers = {
  admin1: { password: "password1", role: "admin" },
  admin2: { password: "password2", role: "admin" },
  user1: { password: "password1", role: "regular" },
  user2: { password: "password2", role: "regular" },
  user3: { password: "password3", role: "regular" },
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  const user = dummyUsers[username];
  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      username,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    token,
    role: user.role,
    username,
  });
};
