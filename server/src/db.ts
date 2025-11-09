import sqlite3 from "sqlite3";
import path from "path";

sqlite3.verbose();

const dbPath = path.resolve(__dirname, "../db.sqlite");

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Erro ao conectar ao banco:", err);
  } else {
    console.log("✅ Banco conectado");
  }
});
