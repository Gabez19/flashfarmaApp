-- Clientes
CREATE TABLE clientes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  cpf TEXT UNIQUE NOT NULL,
  telefone TEXT,
  senha_hash TEXT NOT NULL
);

-- Entregadores
CREATE TABLE entregadores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  cpf TEXT UNIQUE NOT NULL,
  telefone TEXT,
  veiculo_tipo TEXT,
  placa TEXT,
  senha_hash TEXT NOT NULL
);

-- Farmácias (Adm)
CREATE TABLE farmacias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome_adm TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha_hash TEXT NOT NULL,
  razao_social TEXT,
  cnpj TEXT UNIQUE,
  endereco TEXT,
  telefone TEXT
);

-- Funcionários farmácia (Farmacêutico)
CREATE TABLE funcionarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  farmacia_id INTEGER,
  nome TEXT NOT NULL,
  email TEXT UNIQUE,
  matricula TEXT UNIQUE NOT NULL,
  senha_hash TEXT NOT NULL,
  ativo INTEGER DEFAULT 1,
  FOREIGN KEY (farmacia_id) REFERENCES farmacias(id)
);

-- Produtos
CREATE TABLE produtos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  farmacia_id INTEGER,
  nome TEXT NOT NULL,
  imagem TEXT,
  preco REAL,
  estoque INTEGER,
  FOREIGN KEY (farmacia_id) REFERENCES farmacias(id)
);

-- Pedidos
CREATE TABLE pedidos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cliente_id INTEGER,
  farmacia_id INTEGER,
  entregador_id INTEGER,
  status TEXT, -- pendente, preparo, rota, entregue
  valor_total REAL,
  codigo_entrega TEXT,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id),
  FOREIGN KEY (farmacia_id) REFERENCES farmacias(id),
  FOREIGN KEY (entregador_id) REFERENCES entregadores(id)
);

-- Itens do pedido
CREATE TABLE itens_pedido (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pedido_id INTEGER,
  produto_id INTEGER,
  quantidade INTEGER,
  preco_unitario REAL,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
  FOREIGN KEY (produto_id) REFERENCES produtos(id)
);
