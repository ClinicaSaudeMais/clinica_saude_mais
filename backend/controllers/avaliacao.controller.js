import { prisma } from "../prisma/client.js";

export async function criarAvaliacao(req, res) {
  try {
    const { consulta_id, nota, comentario } = req.body;
    if (!consulta_id || nota == null) {
      return res.status(400).json({ message: "consulta_id e nota são obrigatórios." });
    }

    // Verifica se já existe avaliação para a consulta (unique constraint no schema)
    const existe = await prisma.avaliacao.findUnique({ where: { consulta_id: Number(consulta_id) } });
    if (existe) return res.status(400).json({ message: "Consulta já avaliada." });

    const avaliacao = await prisma.avaliacao.create({
      data: {
        consulta_id: Number(consulta_id),
        nota: Number(nota),
        comentario
      }
    });

    res.status(201).json(avaliacao);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function listarAvaliacoes(req, res) {
  try {
    const avaliacoes = await prisma.avaliacao.findMany({
      include: {
        consulta: {
          include: {
            paciente: { include: { usuario: true } },
            medico: { include: { usuario: true } }
          }
        }
      }
    });
    res.json(avaliacoes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}