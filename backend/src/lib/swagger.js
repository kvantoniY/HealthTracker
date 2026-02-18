import swaggerJSDoc from 'swagger-jsdoc';

export function buildSwaggerSpec() {
  const port = Number(process.env.PORT || 4000);

  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Mental Social API',
        version: '1.0.0',
        description: 'Express + SQLite + Sequelize backend for mood tracker + mini social',
      },
      servers: [{ url: `http://localhost:${port}` }],
      components: {
        securitySchemes: {
          bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        },
      },
      security: [{ bearerAuth: [] }],
    },
    apis: ['./src/routes/*.js'],
  };

  return swaggerJSDoc(options);
}
