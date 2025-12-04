import { Router } from "express";
import { 
  listarAgendaPorMedico, 
  criarAgenda, 
  listarTodasAgendas, 
  listarMinhasAgendas,
  criarMinhaAgenda 
} from "../../controllers/agenda.controller.js";
import { authMiddleware } from "../../controllers/auth.middleware.js";

const router = Router();

router.get("/", listarTodasAgendas);
router.get("/meus-cronogramas/medico", authMiddleware, listarMinhasAgendas);
router.post("/meus-cronogramas/medico", authMiddleware, criarMinhaAgenda);
router.get("/:medicoId", listarAgendaPorMedico);
router.post("/", criarAgenda);

export default router;