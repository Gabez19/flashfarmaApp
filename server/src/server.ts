import * as dotenv from "dotenv";
dotenv.config();

import { getEnv } from "./setupEnv";
const JWT_SECRET = getEnv("JWT_SECRET");

import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import deliveriesRoutes from "./routes/deliveries";
import pedidosRoutes from "./routes/pedidos";


const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use("/auth", authRoutes);
app.use("/deliveries", deliveriesRoutes); 
app.use("/pedidos", pedidosRoutes);


app.listen(3000, () => console.log("🚀 API rodando em http://localhost:3000"));
