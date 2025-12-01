const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');
const { authMiddleware } = require('../middleware/auth');

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
 *             administrador:
 *               summary: Criar um usuário Administrador
 *               value:
 *                 cpf: "99988877766"
 *                 data_nascimento: "1980-01-01"
 *                 nome: "Admin"
 *                 sobrenome: "Sistema"
 *                 email: "admin@example.com"
 *                 senha: "admin_password"
 *                 perfil_id: 1
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
        const userId = userResult[0].insertId;

        const perfilSql = `INSERT INTO perfil_usuario (perfil_id, usuario_id) VALUES (?, ?)`;
        await db.query(perfilSql, [perfil_id, userId]);

        if (perfil_id === 2) {
            const medicoSql = `INSERT INTO medico (usuario_id, crm) VALUES (?, ?)`;
            await db.query(medicoSql, [userId, role_data.crm]);
        } else if (perfil_id === 3) {
            const pacienteSql = `INSERT INTO paciente (usuario_id, convenio) VALUES (?, ?)`;
            await db.query(pacienteSql, [userId, role_data.convenio || null]);
        }

        // Inserir contatos
        for (const ctt of contatos) {
            await db.query('INSERT INTO contato (usuario_id, tipo_contato, valor, principal) VALUES (?, ?, ?, ?)', 
                [userId, ctt.tipo_contato, ctt.valor, ctt.principal || false]);
        }

        // Inserir endereços
        for (const end of enderecos) {
            await db.query('INSERT INTO endereco (usuario_id, logradouro, complemento, bairro, cidade, estado, cep) VALUES (?, ?, ?, ?, ?, ?, ?)', 
                [userId, end.logradouro, end.complemento, end.bairro, end.cidade, end.estado, end.cep]);
        }

        await db.execQuery('COMMIT');
        res.status(201).json({ id: userId, cpf, nome, sobrenome, email, data_nascimento, perfil_id, ativo: true });
    } catch (error) {
        await db.execQuery('ROLLBACK');
        console.error("Erro detalhado ao criar usuário:", error);
        res.status(500).json({ message: 'Erro ao criar usuário. Verifique o console do servidor.' });
    }
});

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Lista todos os usuários cadastrados, incluindo dados específicos de cada perfil.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UsuarioOutput'
 *             examples:
 *               exemplo:
 *                 summary: Retorno de múltiplos usuários
 *                 value:
 *                   - id: 1
 *                     cpf: "11122233344"
 *                     nome: "Dr. Carlos"
 *                     sobrenome: "Andrade"
 *                     email: "carlos.andrade@example.com"
 *                     data_nascimento: "1985-05-10"
 *                     perfil_id: 2
 *                     ativo: true
 *                     role_data:
 *                       crm: "12345-SP"
 *                   - id: 2
 *                     cpf: "55566677788"
 *                     nome: "Ana"
 *                     sobrenome: "Beatriz"
 *                     email: "ana.beatriz@example.com"
 *                     data_nascimento: "1992-09-20"
 *                     perfil_id: 3
 *                     ativo: true
 *                     role_data:
 *                       convenio: "Plano Saúde Top"
 *       401:
 *         description: Não autorizado.
 *       500:
 *         description: Erro no servidor.
 *
 */
router.get('/', authMiddleware, async (req, res) => {
    try {
        const sql = `
            SELECT 
                u.id,
                u.cpf,
                u.data_nascimento,
                u.nome,
                u.sobrenome,
                u.email,
                pu.perfil_id,
                CASE 
                    WHEN pu.perfil_id = 2 THEN m.crm
                    WHEN pu.perfil_id = 3 THEN p.convenio
                    ELSE NULL
                END AS role_value
            FROM usuario u
            INNER JOIN perfil_usuario pu ON pu.usuario_id = u.id
            LEFT JOIN medico m ON m.usuario_id = u.id
            LEFT JOIN paciente p ON p.usuario_id = u.id
            ORDER BY u.nome ASC
        `;

        const rows = await db.query(sql);

        // Se o driver retorna [rows, fields], pegue só rows
        const data = rows[0];

        const usuarios = data.map(row => ({
            id: row.id,
            cpf: row.cpf,
            nome: row.nome,
            sobrenome: row.sobrenome,
            email: row.email,
            data_nascimento: row.data_nascimento,
            perfil_id: row.perfil_id,
            ativo: true,
            role_data: row.perfil_id === 2
                ? { crm: row.role_value }
                : row.perfil_id === 3
                    ? { convenio: row.role_value }
                    : {}
        }));

        res.status(200).json(usuarios);

    } catch (error) {
        console.error("Erro ao listar usuários:", error);
        res.status(500).json({ message: 'Erro ao buscar usuários.' });
    }
});


/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Busca um usuário específico pelo ID.
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do usuário.
 *     responses:
 *       200:
 *         description: Dados do usuário retornados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuarioOutput'
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro no servidor.
 */
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const userSql = `
            SELECT
                u.id, u.cpf, u.data_nascimento, u.nome, u.sobrenome, u.email, u.ativo,
                pu.perfil_id,
                p_desc.nome as perfis
            FROM usuario u
            JOIN perfil_usuario pu ON u.id = pu.usuario_id
            JOIN perfil p_desc ON pu.perfil_id = p_desc.id
            WHERE u.id = ?
        `;

        const [userRows] = await db.query(userSql, [id]);

        if (userRows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        const userData = userRows[0];
        
        let roleData = {};
        if (userData.perfil_id === 2) { // Médico
            const [medicoRows] = await db.query('SELECT crm FROM medico WHERE usuario_id = ?', [id]);
            if (medicoRows.length > 0) {
                roleData.crm = medicoRows[0].crm;
            }
        } else if (userData.perfil_id === 3) { // Paciente
            const [pacienteRows] = await db.query('SELECT convenio FROM paciente WHERE usuario_id = ?', [id]);
            if (pacienteRows.length > 0) {
                roleData.convenio = pacienteRows[0].convenio;
            }
        }

        const [contatosRows] = await db.query('SELECT tipo_contato, valor, principal FROM contato WHERE usuario_id = ?', [id]);
        const [enderecosRows] = await db.query('SELECT logradouro, complemento, bairro, cidade, estado, cep FROM endereco WHERE usuario_id = ?', [id]);

        const usuario = {
            id: userData.id,
            cpf: userData.cpf,
            nome: userData.nome,
            sobrenome: userData.sobrenome,
            email: userData.email,
            data_nascimento: userData.data_nascimento,
            ativo: !!userData.ativo,
            perfis: userData.perfis,
            ...roleData,
            contatos: contatosRows,
            enderecos: enderecosRows
        };

        res.status(200).json(usuario);

    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        res.status(500).json({ message: 'Erro ao buscar usuário.' });
    }
});

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Atualiza os dados de um usuário.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do usuário a ser atualizado.
 *     requestBody:
 *       description: "Campos para atualizar. Admins podem atualizar todos os campos. Usuários comuns só podem atualizar 'convenio', 'contatos' e 'enderecos' de sua própria conta."
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: "Nome do usuário (Somente Admin)."
 *               sobrenome:
 *                 type: string
 *                 description: "Sobrenome do usuário (Somente Admin)."
 *               email:
 *                 type: string
 *                 format: email
 *                 description: "Email do usuário (Somente Admin)."
 *               ativo:
 *                 type: boolean
 *                 description: "Status de ativação do usuário (Somente Admin)."
 *               perfil_id:
 *                 type: integer
 *                 description: "ID do Perfil (Somente Admin)."
 *               convenio:
 *                 type: string
 *                 description: "Convênio do paciente (Admin ou proprietário)."
 *               contatos:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Contato'
 *                 description: "Lista de contatos (Admin ou proprietário)."
 *               enderecos:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Endereco'
 *                 description: "Lista de endereços (Admin ou proprietário)."
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso.
 *       403:
 *         description: Acesso negado.
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro no servidor.
 */
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const requester = req.user; // Vem do authMiddleware

    const isOwner = requester.id == id;
    const isAdmin = requester.perfil_id === 1;

    if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para atualizar este usuário.' });
    }

    const { nome, sobrenome, email, ativo, perfil_id, convenio, contatos, enderecos } = req.body;

    try {
        await db.execQuery('BEGIN TRANSACTION');

        // Garante que o usuário a ser atualizado existe
        const [userExists] = await db.query('SELECT id, perfil_id FROM usuario JOIN perfil_usuario ON usuario.id = perfil_usuario.usuario_id WHERE id = ?', [id]);
        if (userExists.length === 0) {
            await db.execQuery('ROLLBACK');
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        const userToUpdate = userExists[0];

        // --- Lógica para campos de Admin ---
        if (isAdmin) {
            const adminFields = { nome, sobrenome, email, ativo };
            const fieldsToUpdate = {};
            
            Object.keys(adminFields).forEach(key => {
                if (adminFields[key] !== undefined && adminFields[key] !== null) {
                    fieldsToUpdate[key] = adminFields[key];
                }
            });

            if (Object.keys(fieldsToUpdate).length > 0) {
                const setClause = Object.keys(fieldsToUpdate).map(key => `${key} = ?`).join(', ');
                const values = Object.values(fieldsToUpdate);
                await db.query(`UPDATE usuario SET ${setClause} WHERE id = ?`, [...values, id]);
            }
            
            if (perfil_id !== undefined) {
                 await db.query(`UPDATE perfil_usuario SET perfil_id = ? WHERE usuario_id = ?`, [perfil_id, id]);
            }
        }

        // --- Lógica para campos do proprietário ou Admin ---
        if (convenio !== undefined && (isAdmin || isOwner)) {
            if (userToUpdate.perfil_id === 3) { // Apenas para pacientes
                await db.query('UPDATE paciente SET convenio = ? WHERE usuario_id = ?', [convenio, id]);
            }
        }

        if (enderecos && Array.isArray(enderecos) && (isAdmin || isOwner)) {
            await db.query('DELETE FROM endereco WHERE usuario_id = ?', [id]);
            for (const end of enderecos) {
                await db.query('INSERT INTO endereco (usuario_id, logradouro, complemento, bairro, cidade, estado, cep) VALUES (?, ?, ?, ?, ?, ?, ?)', 
                    [id, end.logradouro, end.complemento, end.bairro, end.cidade, end.estado, end.cep]);
            }
        }

        if (contatos && Array.isArray(contatos) && (isAdmin || isOwner)) {
            await db.query('DELETE FROM contato WHERE usuario_id = ?', [id]);
            for (const ctt of contatos) {
                await db.query('INSERT INTO contato (usuario_id, tipo_contato, valor, principal) VALUES (?, ?, ?, ?)', 
                    [id, ctt.tipo_contato, ctt.valor, ctt.principal || false]);
            }
        }
        
        await db.execQuery('COMMIT');
        
        const [updatedUserRows] = await db.query('SELECT id, nome, email FROM usuario WHERE id = ?', [id]);
        res.status(200).json({ message: 'Usuário atualizado com sucesso.', usuario: updatedUserRows[0] });

    } catch (error) {
        await db.execQuery('ROLLBACK');
        console.error("Erro ao atualizar usuário:", error);
        res.status(500).json({ message: 'Erro ao atualizar usuário.' });
    }
});

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Deleta um usuário.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do usuário a ser deletado.
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso.
 *       403:
 *         description: Acesso negado.
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro no servidor.
 */
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const requester = req.user;

    // const isOwner = requester.id == id;
    // const isAdmin = requester.perfil_id === 1;

    // if (!isOwner && !isAdmin) {
    //     return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para deletar este usuário.' });
    // }

    try {
        await db.execQuery('BEGIN TRANSACTION');

        const [userExists] = await db.query('SELECT id FROM usuario WHERE id = ?', [id]);
        if (userExists.length === 0) {
            await db.execQuery('ROLLBACK');
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        // Deletar dependências
        await db.query('DELETE FROM perfil_usuario WHERE usuario_id = ?', [id]);
        await db.query('DELETE FROM contato WHERE usuario_id = ?', [id]);
        await db.query('DELETE FROM endereco WHERE usuario_id = ?', [id]);
        await db.query('DELETE FROM medico WHERE usuario_id = ?', [id]);
        await db.query('DELETE FROM paciente WHERE usuario_id = ?', [id]);
        
        // Deletar o usuário principal
        await db.query('DELETE FROM usuario WHERE id = ?', [id]);

        await db.execQuery('COMMIT');

        res.status(200).json({ message: 'Usuário deletado com sucesso.' });

    } catch (error) {
        await db.execQuery('ROLLBACK');
        console.error("Erro ao deletar usuário:", error);
        res.status(500).json({ message: 'Erro ao deletar usuário.' });
    }
});


module.exports = router;