import { prisma } from "../prisma/client.js";

export async function listarAgendaPorMedico(req, res) {
  try {
    const medicoId = Number(req.params.medicoId);
    const agenda = await prisma.agenda.findMany({
      where: { medico_id: medicoId },
      orderBy: { data: "asc" }
    });
    res.json(agenda);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function criarAgenda(req, res) {
  try {
    const { medico_id, data, hora } = req.body;
    if (!medico_id || !data || !hora) {
      return res.status(400).json({ message: "medico_id, data e hora são obrigatórios." });
    }
    const agenda = await prisma.agenda.create({
      data: {
        medico_id: Number(medico_id),
        data: new Date(data),
        hora
      }
    });
    res.status(201).json(agenda);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}