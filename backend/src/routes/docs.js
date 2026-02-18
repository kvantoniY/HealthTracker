import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import YAML from 'yaml';

const router = Router();

function loadSpec() {
  const filePath = path.resolve('src/openapi.yaml');
  const raw = fs.readFileSync(filePath, 'utf8');

  // если порт меняется — красиво подменим server url на текущий порт
  const port = Number(process.env.PORT || 4000);
  const spec = YAML.parse(raw);

  if (Array.isArray(spec.servers) && spec.servers[0]?.url) {
    spec.servers = [{ url: `http://localhost:${port}` }];
  }

  return spec;
}

// Swagger UI
router.use('/docs', swaggerUi.serve, (req, res) => {
  const spec = loadSpec();
  return swaggerUi.setup(spec, {
    swaggerOptions: { persistAuthorization: true },
  })(req, res);
});

// Отдать yaml наружу (удобно для Postman/генераторов)
router.get('/openapi.yaml', (req, res) => {
  const filePath = path.resolve('src/openapi.yaml');
  res.type('text/yaml').send(fs.readFileSync(filePath, 'utf8'));
});

export default router;
