// middleware/jwt-auth.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: "./.env.local" });

export function jwtAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  const [scheme, token] = auth.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Missing or invalid Authorization header" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET); // throws if bad/expired
    req.user = payload; // e.g., { sub: "username", iat, exp }
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
