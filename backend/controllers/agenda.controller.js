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

export async function listarTodasAgendas(req, res) {
  try {
    const agendas = await prisma.agenda.findMany({
      include: {
        medico: {
          include: {
            usuario: true
          }
        }
      },
      orderBy: { data: "desc" }
    });
    res.json(agendas);
  } catch (err)
 {
    console.error(err);
    res.status(500).json({ error: "Ocorreu um erro ao buscar todos os cronogramas." });
  }
}

export async function listarMinhasAgendas(req, res) {
  try {
    const userId = req.user.id;

    // First, find the medico ID associated with the user ID
    const medico = await prisma.medico.findUnique({
      where: { usuario_id: userId },
    });

    if (!medico) {
      return res.status(404).json({ message: "Perfil de médico não encontrado para este usuário." });
    }

    const agendas = await prisma.agenda.findMany({
      where: { medico_id: medico.id },
      include: {
        medico: {
          include: {
            usuario: true
          }
        }
      },
      orderBy: { data: "desc" }
    });

    res.json(agendas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ocorreu um erro ao buscar seus cronogramas." });
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

export async function criarAgendaParaMedico(req, res) {
  try {
    let { medico_id, data, hora } = req.body;

    if (!data || !hora) {
      return res.status(400).json({ message: "Data e hora são obrigatórios." });
    }

    if (!medico_id) {
      const userId = req.user.id;
      const medicoDoUsuario = await prisma.medico.findUnique({
        where: { usuario_id: userId },
      });

      if (!medicoDoUsuario) {
        return res.status(400).json({ message: "ID do médico não fornecido e o usuário logado não é um médico." });
      }
      medico_id = medicoDoUsuario.id;
    } else {
      medico_id = Number(medico_id);
      if (isNaN(medico_id)) {
        return res.status(400).json({ message: "ID do médico inválido." });
      }
    }

    const agenda = await prisma.agenda.create({
      data: {
        medico_id: medico_id,
        data: new Date(data),
        hora,
      },
    });

    res.status(201).json(agenda);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ocorreu um erro ao criar o cronograma." });
  }
}