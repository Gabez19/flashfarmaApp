// src/routes/pedidos.ts
import { Router, Request, Response } from "express";
import { db } from "../db";

const router = Router();

/**
 * GET /pedidos
 * Lista todos os pedidos (pode ser filtrado por cliente_id ?cliente=1)
 */
router.get("/", (req: Request, res: Response) => {
  const clienteId = req.query.cliente;
  let sql = `SELECT * FROM pedidos`;
  const params: any[] = [];
  if (clienteId) {
    sql += ` WHERE cliente_id = ?`;
    params.push(clienteId);
  }
  db.all(sql, params, (err: Error | null, rows: any[]) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar pedidos" });
    res.json(rows);
  });
});

/**
 * GET /pedidos/:id
 * Retorna o pedido e os itens
 */
router.get("/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  db.get("SELECT * FROM pedidos WHERE id = ?", [id], (err: Error | null, pedido: any) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar pedido" });
    if (!pedido) return res.status(404).json({ error: "Pedido não encontrado" });

    db.all("SELECT * FROM pedido_items WHERE pedido_id = ?", [id], (err2: Error | null, items: any[]) => {
      if (err2) return res.status(500).json({ error: "Erro ao buscar itens" });
      res.json({ pedido, items });
    });
  });
});

/**
 * POST /pedidos
 * Cria um pedido com itens:
 * body = {
 *   cliente_id: number,
 *   farmacia_id: number,             // opcional
 *   items: [{ produto_id?, nome_produto, quantidade, preco_unitario }]
 * }
 */
router.post("/", (req: Request, res: Response) => {
  const { cliente_id, farmacia_id, items } = req.body;

  if (!cliente_id || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Dados do pedido inválidos" });
  }

  // calcula total
  const itemsPrepared = items.map((it: any) => {
    const quantidade = Number(it.quantidade || 1);
    const preco_unitario = Number(it.preco_unitario || 0);
    const subtotal = Math.round((quantidade * preco_unitario) * 100) / 100;
    return { ...it, quantidade, preco_unitario, subtotal };
  });

  const total = itemsPrepared.reduce((acc: number, it: any) => acc + it.subtotal, 0);
  const totalFixed = Math.round(total * 100) / 100;

  // inserir pedido
  db.run(
    `INSERT INTO pedidos (cliente_id, farmacia_id, valor_total, status) VALUES (?, ?, ?, ?)`,
    [cliente_id, farmacia_id || null, totalFixed, "pendente"],
    function (err: Error | null) {
      if (err) return res.status(500).json({ error: "Erro ao criar pedido" });

      const pedidoId = (this as any).lastID;

      // insere itens
      const stmt = db.prepare(`
        INSERT INTO pedido_items (pedido_id, produto_id, nome_produto, quantidade, preco_unitario, subtotal)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      for (const it of itemsPrepared) {
        stmt.run(pedidoId, it.produto_id || null, it.nome_produto, it.quantidade, it.preco_unitario, it.subtotal);
      }

      stmt.finalize((err2: Error | null) => {
        if (err2) {
          return res.status(500).json({ error: "Erro ao inserir itens do pedido" });
        }

        // responder com o pedido criado
        db.get("SELECT * FROM pedidos WHERE id = ?", [pedidoId], (err3: Error | null, created: any) => {
          if (err3) return res.status(500).json({ error: "Erro ao buscar pedido criado" });
          res.json({ message: "Pedido criado", pedido: created, items: itemsPrepared });
        });
      });
    }
  );
});

/**
 * PATCH /pedidos/:id/status
 * Atualiza status do pedido
 * body: { status: 'em_rota' } etc
 */
router.patch("/:id/status", (req: Request, res: Response) => {
  const id = req.params.id;
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: "status obrigatório" });

  db.run("UPDATE pedidos SET status = ? WHERE id = ?", [status, id], function (err: Error | null) {
    if (err) return res.status(500).json({ error: "Erro ao atualizar status" });
    if ((this as any).changes === 0) return res.status(404).json({ error: "Pedido não encontrado" });
    res.json({ message: "Status atualizado" });
  });
});

export default router;
