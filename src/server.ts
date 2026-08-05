import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import yaml from 'js-yaml';
import swaggerUi from 'swagger-ui-express';
import { rotaNaoEncontrada, tratadorDeErros } from './errors/middleware';
import { healthRouter } from './routes/healthRouter';
import { pedidosRouter } from './routes/pedidosRouter';

const app = express();
app.use(express.json());

const documentoOpenApi = yaml.load(
  fs.readFileSync(path.join(__dirname, '..', 'openapi.yaml'), 'utf8'),
) as Record<string, unknown>;

app.use('/docs', swaggerUi.serve, swaggerUi.setup(documentoOpenApi));

app.use(healthRouter);
app.use(pedidosRouter);

app.use(rotaNaoEncontrada);
app.use(tratadorDeErros);

const porta = Number(process.env.PORT) || 2000;

app.listen(porta, () => {
  console.log(`API de pedidos rodando em http://localhost:${porta}`);
  console.log(`Documentação em http://localhost:${porta}/docs`);
});
