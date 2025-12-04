import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-default-secret";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token não fornecido." });

  const parts = authHeader.split(" ");
  if (parts.length !== 2) return res.status(401).json({ message: "Token inválido." });

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) return res.status(401).json({ message: "Token mal formatado." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // id, email, nome, perfis (como enviado no login)
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
}