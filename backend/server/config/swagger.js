const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API da Clínica Saúde Mais',
    version: '1.0.0',
    description: 'Documentação da API para o sistema da Clínica Saúde Mais',
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Servidor de Desenvolvimento',
    },
  ],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/api.js', './routes/usuarios.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
