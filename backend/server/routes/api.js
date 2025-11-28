const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Teste
 *   description: Rotas de teste.
 */

/**
 * @swagger
 * /api/mensagem:
 *   get:
 *     summary: Retorna uma mensagem de teste.
 *     tags: [Teste]
 *     responses:
 *       200:
 *         description: Mensagem de teste retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Conexão com o backend bem-sucedida!"
 */
router.get('/mensagem', (req, res) => {
    res.json({ message: 'Conexão com o backend bem-sucedida!' });
});

// Importa as rotas de usuários
const usuariosRoutes = require('./usuarios');

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: API para gerenciamento de usuários.
 */
router.use('/usuarios', usuariosRoutes);

module.exports = router;