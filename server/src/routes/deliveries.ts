import { Router } from "express";
import { db } from "../db";

const router = Router();

// GET /deliveries -> retorna todas as entregas
router.get("/", (req, res) => {
  db.all("SELECT * FROM deliveries", [], (err: Error | null, rows: any[]) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar entregas" });
    }
    res.json(rows);
  });
});

// POST /deliveries -> cadastra nova entrega
router.post("/", (req, res) => {
  const { cliente_id, endereco_entrega, status } = req.body;

  if (!cliente_id || !endereco_entrega) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  db.run(
    `INSERT INTO deliveries (cliente_id, endereco_entrega, status)
     VALUES (?, ?, ?)`,
    [cliente_id, endereco_entrega, status || "pendente"],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Erro ao criar entrega" });
      }
      res.json({ message: "Entrega criada", id: this.lastID });
    }
  );
});

export default router;
