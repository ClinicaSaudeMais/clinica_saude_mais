// src/app.js
import express from "express";
import cors from "cors";

import pacienteRoutes from "./routes/paciente.routes.js";
import medicoRoutes from "./routes/medico.routes.js";
import consultaRoutes from "./routes/consulta.routes.js";
import agendaRoutes from "./routes/agenda.routes.js";
import avaliacaoRoutes from "./routes/avaliacao.routes.js";
import usuarioRoutes from "./routes/usuario.routes.js";
import authRoutes from "./routes/auth.routes.js"; // Import auth routes

const app = express();

app.use(cors({
  origin: true, // Reflete a origem da requisição, útil para desenvolvimento
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors()); // Habilita pre-flight para todas as rotas
app.use(express.json());

// Rotas do sistema com prefixo /api
app.use("/api/pacientes", pacienteRoutes);
app.use("/api/medicos", medicoRoutes);
app.use("/api/consultas", consultaRoutes);
app.use("/api/agenda", agendaRoutes);
app.use("/api/avaliacoes", avaliacaoRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/auth", authRoutes); // Use auth routes

export default app;