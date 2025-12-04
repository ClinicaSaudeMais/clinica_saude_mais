import { Router } from "express";
import { 
  criarConsulta, 
  listarConsultas, 
  listarMinhasConsultas,
  criarMinhaConsulta
} from "../../controllers/consulta.controller.js";
import { authMiddleware } from "../../controllers/auth.middleware.js";

const router = Router();

router.get("/", listarConsultas);
router.get("/meus-agendamentos", authMiddleware, listarMinhasConsultas);
router.post("/", criarConsulta);
router.post("/minha-consulta", authMiddleware, criarMinhaConsulta);

export default router;