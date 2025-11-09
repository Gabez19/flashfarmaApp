// src/seed.ts
import * as path from "path";
import * as sqlite3 from "sqlite3";

const dbPath = path.resolve(__dirname, "../db.sqlite");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  console.log("🛠️ Criando tabelas...");

  // users
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL,
      tipo TEXT NOT NULL CHECK(tipo IN ('cliente', 'farmaceutico', 'admin', 'entregador'))
    );
  `);

  // farmacias
  db.run(`
    CREATE TABLE IF NOT EXISTS farmacias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      cidade TEXT NOT NULL,
      admin_id INTEGER UNIQUE,
      FOREIGN KEY (admin_id) REFERENCES users(id)
    );
  `);

  // produtos (simples)
  db.run(`
    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      farmacia_id INTEGER,
      nome TEXT NOT NULL,
      descricao TEXT,
      preco REAL NOT NULL,
      estoque INTEGER DEFAULT 0,
      imagem TEXT,
      FOREIGN KEY (farmacia_id) REFERENCES farmacias(id)
    );
  `);

  // deliveries (mantemos se quiser usar)
  db.run(`
    CREATE TABLE IF NOT EXISTS deliveries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_id INTEGER NOT NULL,
      endereco_entrega TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('pendente', 'em_rota', 'concluida')) DEFAULT 'pendente',
      data TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cliente_id) REFERENCES users(id)
    );
  `);

  // pedidos
  db.run(`
    CREATE TABLE IF NOT EXISTS pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_id INTEGER NOT NULL,
      farmacia_id INTEGER,
      valor_total REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'pendente', -- pendente, confirmado, em_rota, entregue, cancelado
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cliente_id) REFERENCES users(id),
      FOREIGN KEY (farmacia_id) REFERENCES farmacias(id)
    );
  `);

  // itens do pedido
  db.run(`
    CREATE TABLE IF NOT EXISTS pedido_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pedido_id INTEGER NOT NULL,
      produto_id INTEGER,
      nome_produto TEXT NOT NULL,
      quantidade INTEGER NOT NULL,
      preco_unitario REAL NOT NULL,
      subtotal REAL NOT NULL,
      FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
      FOREIGN KEY (produto_id) REFERENCES produtos(id)
    );
  `);

  console.log("🌱 Inserindo dados iniciais...");

  // Inserir usuários (apenas se não existirem)
  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (id, nome, email, senha, tipo) VALUES (?, ?, ?, ?, ?)
  `);

  insertUser.run(1, "Cliente Teste", "cliente@teste.com", "123456", "cliente");
  insertUser.run(2, "Carlos Farmacêutico", "farmaceutico@terra.com", "123456", "farmaceutico");
  insertUser.run(3, "Admin Terra", "admin@terra.com", "123456", "admin");
  insertUser.run(4, "João Silva", "entregador@terra.com", "123456", "entregador");

  insertUser.finalize();

  // Vincular farmácia ao admin (id 1..)
  db.run(`
    INSERT OR IGNORE INTO farmacias (id, nome, cidade, admin_id)
    VALUES (1, 'Drogaria Terra', 'Brasília - DF', 3);
  `);

  // Inserir produtos exemplo para a farmácia 1
  const insertProduto = db.prepare(`
    INSERT OR IGNORE INTO produtos (id, farmacia_id, nome, descricao, preco, estoque)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertProduto.run(1, 1, "Dipirona 500mg", "Analgesico", 5.99, 20);
  insertProduto.run(2, 1, "Paracetamol 500mg", "Antitermico", 7.5, 30);
  insertProduto.finalize();

  // Inserir uma entrega de exemplo (opcional)
  db.run(`
    INSERT OR IGNORE INTO deliveries (id, cliente_id, endereco_entrega, status)
    VALUES (1, 1, 'Rua das Flores, Nº 100 - Brasília', 'pendente');
  `);

  // Inserir um pedido exemplo (opcional)
  db.run(`
    INSERT OR IGNORE INTO pedidos (id, cliente_id, farmacia_id, valor_total, status)
    VALUES (1, 1, 1, 13.49, 'pendente');
  `);

  // Inserir itens do pedido exemplo
  db.run(`
    INSERT OR IGNORE INTO pedido_items (id, pedido_id, produto_id, nome_produto, quantidade, preco_unitario, subtotal)
    VALUES (1, 1, 1, 'Dipirona 500mg', 1, 5.99, 5.99),
           (2, 1, 2, 'Paracetamol 500mg', 1, 7.5, 7.5);
  `);

  console.log("✅ Banco populado com sucesso!");
});

db.close();
