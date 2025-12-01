const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Lembre-se de adicionar a variável JWT_SECRET ao seu arquivo .env
const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_super_secreto_para_desenvolvimento';

/**
 * @swagger
 * tags:
 *   name: Autenticacao
 *   description: API para autenticação de usuários.
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Realiza o login do usuário e retorna um token JWT.
 *     tags: [Autenticacao]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               senha:
 *                 type: string
 *                 format: password
 *           examples:
 *             usuarioComum:
 *               summary: Login de um usuário comum
 *               value:
 *                 email: "carlos.andrade@example.com"
 *                 senha: "senhaforte123"
 *             admin:
 *               summary: Login de um usuário Administrador
 *               value:
 *                 email: "admin@example.com"
 *                 senha: "admin_password"
 *     responses:
 *       200:
 *         description: Login bem-sucedido. Retorna o token de autenticação.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login bem-sucedido!"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicGVyZmlsX2lkIjoyLCJpYXQiOjE2MTYyMzkwMjIsImV4cCI6MTYxNjI0MjYyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 *       400:
 *         description: Email ou senha não fornecidos.
 *       401:
 *         description: Credenciais inválidas.
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro no servidor.
 */
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    try {
        const sql = `
            SELECT u.id, u.nome, u.email, u.senha, pu.perfil_id
            FROM usuario u
            JOIN perfil_usuario pu ON u.id = pu.usuario_id
            WHERE TRIM(u.email) = ?
        `;
        const [users] = await db.query(sql, [email.trim()]);

        console.log("Resultado da consulta de login:", users);

        if (users.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        const user = users[0];
        
        const isMatch = await bcrypt.compare(senha, user.senha);

        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        const payload = {
            id: user.id,
            perfil_id: user.perfil_id
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login bem-sucedido!', token: token });

    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ message: 'Erro no servidor durante o login.' });
    }
});

module.exports = router;
