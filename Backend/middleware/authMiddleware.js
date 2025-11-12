import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Store user info for later use
    next();
  } catch (err) {
    console.error("❌ Token verification error:", err.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}
