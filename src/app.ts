import express from 'express';
import cors from 'cors';
import path from 'path';
import { 
  ExamsResultsRoutes,
  ExamsRoutes, 
  FormatterRoutes, 
  PatientsRoutes, 
  PatientResultsRoutes, 
  TemplatesRoutes,
  UsersRoutes 
} from './Views';
import cookieParser from 'cookie-parser'
import { validateUserSession } from './Middlewares';
import { getTemplatesDir } from './utils/getTemplatesDir';
import { env } from './env';

const apiPrefix = '/api';
const app = express();

const returnStaticDir = () => path.join(getTemplatesDir(), 'assets');

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3333',
    'https://rosceli-web-app.sxhtn0.easypanel.host',
    'https://app.roscelibras.com.br',
  ],
  credentials: true,
  allowedHeaders: [
    'Content-Type', 
    'Authorization',
    'Access-Control-Allow-Credentials',
    'Access-Control-Allow-Origin',
  ],
}));
app.use('/assets', express.static(returnStaticDir()));
app.use(cookieParser());
app.use(express.json());
app.use(apiPrefix, UsersRoutes);
app.use(apiPrefix, validateUserSession);
app.use(apiPrefix, FormatterRoutes);
app.use(apiPrefix, ExamsRoutes);
app.use(apiPrefix, ExamsResultsRoutes);
app.use(apiPrefix, PatientsRoutes);
app.use(apiPrefix, PatientResultsRoutes);
app.use(TemplatesRoutes);

const PORT = parseInt(env.API_PORT) || 3333;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));