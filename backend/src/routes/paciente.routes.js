import { Router } from "express";
import { criarPaciente, listarPacientes } from "../../controllers/paciente.controller.js";

const router = Router();

router.post("/", criarPaciente);
router.get("/", listarPacientes);

export default router;