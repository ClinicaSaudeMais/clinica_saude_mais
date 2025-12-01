// src/app.js
import express from "express";
import cors from "cors";

import pacienteRoutes from "./routes/paciente.routes.js";
import medicoRoutes from "./routes/medico.routes.js";
import consultaRoutes from "./routes/consulta.routes.js";
import agendaRoutes from "./routes/agenda.routes.js";
import avaliacaoRoutes from "./routes/avaliacao.routes.js";
import usuarioRoutes from "./routes/usuario.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Rotas do sistema
app.use("/pacientes", pacienteRoutes);
app.use("/medicos", medicoRoutes);
app.use("/consultas", consultaRoutes);
app.use("/agenda", agendaRoutes);
app.use("/avaliacoes", avaliacaoRoutes);
app.use("/usuarios", usuarioRoutes);

export default app;