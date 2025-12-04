import { Router } from "express";
import { listarAvaliacoes, criarAvaliacao } from "../../controllers/avaliacao.controller.js";

const router = Router();

router.get("/", listarAvaliacoes);
router.post("/", criarAvaliacao);

export default router;