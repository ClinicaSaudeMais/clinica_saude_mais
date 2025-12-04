import { prisma } from "../prisma/client.js";

export async function criarConsulta(req, res) {
  try {
    const { paciente_id, medico_id, agenda_id } = req.body;
    if (!paciente_id || !medico_id || !agenda_id) {
      return res.status(400).json({ message: "paciente_id, medico_id e agenda_id são obrigatórios." });
    }

    // Verifica agenda
    const agenda = await prisma.agenda.findUnique({ where: { id: Number(agenda_id) } });
    if (!agenda) return res.status(404).json({ message: "Horário não encontrado." });
    if (!agenda.disponibilidade) return res.status(400).json({ message: "Horário indisponível." });

    // Verifica se já existe consulta do mesmo paciente na mesma agenda (duplicidade)
    const consultaExistente = await prisma.consulta.findFirst({
      where: {
        paciente_id: Number(paciente_id),
        agenda_id: Number(agenda_id)
      }
    });
    if (consultaExistente) {
      return res.status(400).json({ message: "Consulta já agendada para esse horário." });
    }

    // Cria consulta dentro de transação para evitar race conditions
    const result = await prisma.$transaction(async (prismaTx) => {
      const consulta = await prismaTx.consulta.create({
        data: {
          paciente_id: Number(paciente_id),
          medico_id: Number(medico_id),
          agenda_id: Number(agenda_id)
        }
      });

      await prismaTx.agenda.update({
        where: { id: Number(agenda_id) },
        data: { disponibilidade: false }
      });

      return consulta;
    });

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function listarConsultas(req, res) {
  try {
    const consultas = await prisma.consulta.findMany({
      include: {
        paciente: { include: { usuario: true } },
        medico: { include: { usuario: true } },
        agenda: true,
        avaliacao: true
      },
      orderBy: { id: "desc" }
    });
    res.json(consultas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}