import { Router } from "express";
import { listarAgendaPorMedico, criarAgenda } from "../../controllers/agenda.controller.js";

const router = Router();

router.get("/:medicoId", listarAgendaPorMedico);
router.post("/", criarAgenda);

export default router;