import { prisma } from "../prisma/client.js";

export async function listarPerfis(req, res) {
  try {
    const perfis = await prisma.perfil.findMany();
    res.json(perfis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
