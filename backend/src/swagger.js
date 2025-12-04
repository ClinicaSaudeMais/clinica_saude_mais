import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Clínica Saúde Mais',
      version: '1.0.0',
      description: 'Documentação da API da Clínica Saúde Mais - Sistema de gerenciamento de consultas médicas',
      contact: {
        name: 'Clínica Saúde Mais',
        email: 'contato@clinicasaudemais.com.br'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento'
      }
    ],
    tags: [
      {
        name: 'Autenticação',
        description: 'Endpoints de autenticação e login'
      },
      {
        name: 'Usuários',
        description: 'Gerenciamento de usuários do sistema'
      },
      {
        name: 'Pacientes',
        description: 'Gerenciamento de pacientes'
      },
      {
        name: 'Médicos',
        description: 'Gerenciamento de médicos'
      },
      {
        name: 'Agenda',
        description: 'Gerenciamento de horários disponíveis dos médicos'
      },
      {
        name: 'Consultas',
        description: 'Gerenciamento de consultas médicas'
      },
      {
        name: 'Avaliações',
        description: 'Gerenciamento de avaliações de consultas'
      }
    ]
  },
  apis: ['./src/docs/*.yaml']
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
