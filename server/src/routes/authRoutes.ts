import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { getEnv } from "../setupEnv";

const router = Router();
const JWT_SECRET = getEnv("JWT_SECRET");

interface User {
  id: number;
  nome: string;
  email: string;
  tipo: "cliente" | "farmaceutico" | "admin" | "entregador";
}

router.post("/login", (req: Request, res: Response) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "Email e senha são obrigatórios" });
  }

  db.get(
    `SELECT id, nome, email, tipo FROM users WHERE email = ? AND senha = ?`,
    [email, senha],
    (err, user: User | undefined) => {
      if (err) {
        return res.status(500).json({ error: "Erro no servidor" });
      }

      if (!user) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      const token = jwt.sign(
        {
          id: user.id,
          nome: user.nome,
          email: user.email,
          tipo: user.tipo
        },
        JWT_SECRET,
        { expiresIn: "2h" }
      );

      res.json({ token, user });
    }
  );
});

export default router;
