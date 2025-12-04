import { Router } from "express";
import { listarMedicos, listarMedicoPorId } from "../../controllers/medico.controller.js";

const router = Router();

router.get("/", listarMedicos);
router.get("/:id", listarMedicoPorId);

export default router;