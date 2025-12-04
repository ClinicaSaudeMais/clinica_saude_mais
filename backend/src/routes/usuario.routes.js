import { Router } from "express";
import { 
  criarUsuario, 
  listarUsuarios, 
  listarUsuarioPorId, 
  ativarUsuario, 
  desativarUsuario,
  listarTodosMedicos
} from "../../controllers/usuario.controller.js";

const router = Router();

router.post("/", criarUsuario);
router.get("/", listarUsuarios);
router.get("/role/medicos", listarTodosMedicos);
router.get("/:id", listarUsuarioPorId);
router.put("/:id/ativar", ativarUsuario);
router.put("/:id/desativar", desativarUsuario);

export default router;