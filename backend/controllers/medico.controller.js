import { prisma } from "../prisma/client.js";

export async function listarMedicos(req, res) {
  try {
    const medicos = await prisma.medico.findMany({
      include: {
        usuario: true,
        especialidade: { include: { especialidade: true } }
      }
    });
    res.json(medicos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function listarMedicoPorId(req, res) {
  try {
    const id = Number(req.params.id);
    const medico = await prisma.medico.findUnique({
      where: { id },
      include: {
        usuario: true,
        agendas: true,
        especialidade: { include: { especialidade: true } }
      }
    });
    if (!medico) return res.status(404).json({ message: "Médico não encontrado." });
    res.json(medico);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}