const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  console.log(authHeader);
  if (!authHeader) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(500).json({ error: "Failed to authenticate token" });
  }
  console.log(decodedToken);
  if (!decodedToken) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  req.userId = decodedToken.userId;
  next();
};
