import { prisma } from "../prisma/client.js";

export async function criarPaciente(req, res) {
  try {
    const paciente = await prisma.paciente.create({
      data: req.body
    });
    res.json(paciente);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function listarPacientes(req, res) {
  const pacientes = await prisma.paciente.findMany();
  res.json(pacientes);
}