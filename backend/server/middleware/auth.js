const jwt = require('jsonwebtoken');

// Lembre-se de adicionar a variável JWT_SECRET ao seu arquivo .env
const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_super_secreto_para_desenvolvimento';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Adiciona o payload decodificado (ex: { id: 1, perfil_id: 2 }) ao request
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expirado.' });
        }
        res.status(401).json({ message: 'Token inválido.' });
    }
};

// Middleware para checar se o usuário é Administrador
const isAdmin = (req, res, next) => {
    // req.user é populado pelo authMiddleware
    if (req.user && req.user.perfil_id === 1) { // 1 = Administrador
        next();
    } else {
        res.status(403).json({ message: 'Acesso negado. Requer privilégios de Administrador.' });
    }
};


module.exports = {
    authMiddleware,
    isAdmin
};
