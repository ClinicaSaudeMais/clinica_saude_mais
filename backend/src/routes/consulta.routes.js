import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  res.send("Rota de consultas funcionando");
});

export default router;