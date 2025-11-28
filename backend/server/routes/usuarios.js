const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');

const saltRounds = 10;

/**
 * @swagger
 * components:
 *   schemas:
 *     UsuarioOutput:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         cpf:
 *           type: string
 *         nome:
 *           type: string
 *         sobrenome:
 *           type: string
 *         email:
 *           type: string
 *         data_nascimento:
 *           type: string
 *           format: date
 *         ativo:
 *           type: boolean
 *         perfis:
 *           type: string
 *           description: "Perfis do usuário (e.g., 'Médico,Paciente')."
 *         crm:
 *           type: string
 *           description: "CRM (se for médico)."
 *         convenio:
 *           type: string
 *           description: "Convênio (se for paciente)."
 *         contatos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Contato'
 *         enderecos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Endereco'
 *     DetalhesPerfil:
 *       oneOf:
 *         - $ref: '#/components/schemas/Medico'
 *         - $ref: '#/components/schemas/Paciente'
 *     Medico:
 *       type: object
 *       properties:
 *         crm:
 *           type: string
 *           description: "CRM do médico (Obrigatório se perfil_id for 2)."
 *     Paciente:
 *       type: object
 *       properties:
 *         convenio:
 *           type: string
 *           description: "Convênio do paciente (Opcional)."
 *     Usuario:
 *       type: object
 *       required:
 *         - cpf
 *         - nome
 *         - email
 *         - senha
 *         - perfil_id
 *       properties:
 *         cpf:
 *           type: string
 *         data_nascimento:
 *           type: string
 *           format: date
 *         nome:
 *           type: string
 *         sobrenome:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         senha:
 *           type: string
 *           format: password
 *         perfil_id:
 *           type: integer
 *           description: "ID do perfil (1: Administrador, 2: Médico, 3: Paciente)."
 *         role_data:
 *           $ref: '#/components/schemas/DetalhesPerfil'
 *     Contato:
 *       type: object
 *       properties:
 *         tipo_contato:
 *           type: string
 *         valor:
 *           type: string
 *         principal:
 *           type: boolean
 *     Endereco:
 *       type: object
 *       properties:
 *         logradouro:
 *           type: string
 *         complemento:
 *           type: string
 *         bairro:
 *           type: string
 *         cidade:
 *           type: string
 *         estado:
 *           type: string
 *         cep:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: API para gerenciamento de usuários.
 */

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Cria um novo usuário com perfil e papel associado (médico/paciente).
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *           examples:
 *             medico:
 *               summary: Criar um usuário Médico
 *               value:
 *                 cpf: "11122233344"
 *                 data_nascimento: "1985-05-10"
 *                 nome: "Dr. Carlos"
 *                 sobrenome: "Andrade"
 *                 email: "carlos.andrade@example.com"
 *                 senha: "senhaforte123"
 *                 perfil_id: 2
 *                 role_data:
 *                   crm: "12345-SP"
 *             paciente:
 *               summary: Criar um usuário Paciente
 *               value:
 *                 cpf: "55566677788"
 *                 data_nascimento: "1992-09-20"
 *                 nome: "Ana"
 *                 sobrenome: "Beatriz"
 *                 email: "ana.beatriz@example.com"
 *                 senha: "senhaforte456"
 *                 perfil_id: 3
 *                 role_data:
 *                   convenio: "Plano Saúde Top"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuarioOutput'
 *       400:
 *         description: Dados inválidos ou ausentes.
 *       409:
 *         description: CPF ou Email já cadastrado.
 *       500:
 *         description: Erro no servidor.
 */
router.post('/', async (req, res) => {
    const { cpf, data_nascimento, nome, sobrenome, email, senha, perfil_id, role_data = {} } = req.body;

    if (!cpf || !nome || !email || !senha || !perfil_id) {
        return res.status(400).json({ message: 'CPF, nome, email, senha e perfil_id são obrigatórios.' });
    }
    if (![1, 2, 3].includes(perfil_id)) {
        return res.status(400).json({ message: 'perfil_id inválido. Use 1 para Admin, 2 para Médico, ou 3 para Paciente.' });
    }
    if (perfil_id === 2 && (!role_data.crm)) {
        return res.status(400).json({ message: 'O campo role_data.crm é obrigatório para o perfil Médico.' });
    }

    try {
        await db.execQuery('BEGIN TRANSACTION');
        const [existe] = await db.query('SELECT id FROM usuario WHERE cpf = ? OR email = ?', [cpf, email]);
        if (existe.length > 0) {
            await db.execQuery('ROLLBACK');
            return res.status(409).json({ message: 'CPF ou Email já cadastrado.' });
        }
        
        const hashedPassword = await bcrypt.hash(senha, saltRounds);
        const userSql = `INSERT INTO usuario (cpf, data_nascimento, nome, sobrenome, email, senha) VALUES (?, ?, ?, ?, ?, ?)`;
        const userParams = [cpf, data_nascimento, nome, sobrenome, email, hashedPassword];
        const userResult = await db.query(userSql, userParams);
        const userId = userResult.insertId;

        const perfilSql = `INSERT INTO perfil_usuario (perfil_id, usuario_id) VALUES (?, ?)`;
        await db.query(perfilSql, [perfil_id, userId]);

        if (perfil_id === 2) {
            const medicoSql = `INSERT INTO medico (usuario_id, crm) VALUES (?, ?)`;
            await db.query(medicoSql, [userId, role_data.crm]);
        } else if (perfil_id === 3) {
            const pacienteSql = `INSERT INTO paciente (usuario_id, convenio) VALUES (?, ?)`;
            await db.query(pacienteSql, [userId, role_data.convenio || null]);
        }

        await db.execQuery('COMMIT');
        res.status(201).json({ id: userId, cpf, nome, sobrenome, email, data_nascimento, perfil_id, ativo: true });
    } catch (error) {
        await db.execQuery('ROLLBACK');
        console.error("Erro detalhado ao criar usuário:", error);
        res.status(500).json({ message: 'Erro ao criar usuário. Verifique o console do servidor.' });
    }
});



module.exports = router;