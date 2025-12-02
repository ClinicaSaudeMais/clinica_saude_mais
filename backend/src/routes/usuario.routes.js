import { Router } from "express";
import { criarUsuario, listarUsuarios } from "../../controllers/usuario.controller.js";

const router = Router();

router.post("/", criarUsuario);
router.get("/", listarUsuarios);

export default router;