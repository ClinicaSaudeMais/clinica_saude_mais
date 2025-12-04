import { Router } from "express";
import { listarPerfis } from "../../controllers/perfil.controller.js";

const router = Router();

router.get("/", listarPerfis);

export default router;
