import { prisma } from "../prisma/client.js";
import bcrypt from "bcryptjs";

export async function criarUsuario(req, res) {
  try {
    const { cpf, data_nascimento, nome, sobrenome, email, senha } = req.body;

    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
      data: {
        cpf,
        data_nascimento: new Date(data_nascimento),
        nome,
        sobrenome,
        email,
        senha: senhaHash
      }
    });

    res.status(201).json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function listarUsuarios(req, res) {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
