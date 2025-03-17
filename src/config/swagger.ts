// config/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT!;
console.log(PORT);

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0', // Especifica la versión de OpenAPI
    info: {
      title: 'API Documentation', // Título de la documentación
      version: '1.0.0', // Versión de la API
      description: 'Documentación de la API usando Swagger', // Descripción
    },
    servers: [
      {
        url: `http://localhost:${PORT}`, // URL base de tu API
        description: 'Servidor local',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Juan Pérez' },
            dni: { type: 'string', example: '12345678' },
            email: {
              type: 'string',
              format: 'email',
              example: 'juan.perez@example.com',
            },
            password_hash: { type: 'string', example: '$2b$10$examplehash' },
            role: {
              type: 'string',
              enum: ['Usuario', 'Técnico', 'Administrador'],
              example: 'Usuario',
            },
            status: {
              type: 'string',
              enum: ['Habilitado', 'Deshabilitado'],
              example: 'Habilitado',
            },
            profile_picture: {
              type: 'string',
              format: 'uri',
              example: 'https://example.com/profile.jpg',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2024-03-17T12:34:56Z',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              example: '2024-03-17T12:34:56Z',
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Ruta a los archivos donde están definidas tus rutas
};

const swaggerSpec = swaggerJsdoc(options);

export const swaggerSetup = (app: any) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
