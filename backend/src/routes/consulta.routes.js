import { Router } from "express";
import { criarConsulta, listarConsultas } from "../../controllers/consulta.controller.js";

const router = Router();

router.get("/", listarConsultas);
router.post("/", criarConsulta);

export default router;