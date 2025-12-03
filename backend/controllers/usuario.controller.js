import { prisma } from "../prisma/client.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret';

export async function criarUsuario(req, res) {
  try {
    const { 
      cpf, data_nascimento, nome, sobrenome, email, senha, 
      perfil_id, contatos, enderecos, role_data 
    } = req.body;

    // Check if user already exists
    const userExists = await prisma.usuario.findFirst({
      where: { OR: [{ email }, { cpf }] }
    });

    if (userExists) {
      return res.status(400).json({ message: "Usuário com este e-mail ou CPF já existe." });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const createData = {
      cpf,
      data_nascimento: new Date(data_nascimento),
      nome,
      sobrenome,
      email,
      senha: senhaHash,
      perfis: {
        create: {
          perfil_id: perfil_id,
        },
      },
    };

    if (contatos && contatos.length > 0) {
      createData.contato = { create: contatos };
    }

    if (enderecos && enderecos.length > 0) {
      // Assuming one address from the frontend array
      createData.endereco = { create: enderecos[0] };
    }
    
    // Create role-specific data
    // Assuming perfil_id 3 is Paciente, 2 is Medico, etc.
    if (perfil_id === 3 && role_data?.convenio) { // Paciente
        createData.paciente = { create: { convenio: role_data.convenio } };
    } else if (perfil_id === 2 && role_data?.crm) { // Medico
        createData.medico = { create: { crm: role_data.crm } };
    }


    const usuario = await prisma.usuario.create({
      data: createData,
      include: {
        contato: true,
        endereco: true,
        perfis: { include: { perfil: true } },
        paciente: true,
        medico: true,
      },
    });

    // Don't send back the password
    const { senha: _, ...userWithoutPassword } = usuario;

    res.status(201).json(userWithoutPassword);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ocorreu um erro ao criar o usuário.", details: err.message });
  }
}

export async function listarUsuarios(req, res) {
  try {
    const usuarios = await prisma.usuario.findMany({
        include: {
            perfis: {
                include: {
                    perfil: true
                }
            }
        }
    });
    // Don't send back passwords
    const usersWithoutPasswords = usuarios.map(u => {
        const {senha: _, ...user} = u;
        return user;
    });
    res.json(usersWithoutPasswords);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function loginUsuario(req, res) {
    try {
        const { email, senha } = req.body;

        const usuario = await prisma.usuario.findUnique({
            where: { email },
            include: { perfis: { include: { perfil: true } } }
        });

        if (!usuario) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ message: "E-mail ou senha inválidos." });
        }

        const token = jwt.sign(
            { 
                id: usuario.id, 
                email: usuario.email,
                nome: usuario.nome,
                perfis: usuario.perfis.map(p => p.perfil.nome)
            }, 
            JWT_SECRET, 
            { expiresIn: '1h' }
        );

        const { senha: _, ...userWithoutPassword } = usuario;

        res.json({ token, usuario: userWithoutPassword });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ocorreu um erro ao fazer login.", details: err.message });
    }
}
