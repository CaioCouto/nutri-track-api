import express from 'express';
import cors from 'cors';
import { 
  ExamsResultsViews,
  ExamsRoutes, 
  FormatterRoutes, 
  PatientsRoutes, 
  PatientResultsRoutes, 
  UsersRoutes 
} from './Views';
import cookieParser from 'cookie-parser'
import { validateUserSession } from './Middlewares';


const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
  ],
  credentials: true,
  allowedHeaders: [
    'Content-Type', 
    'Authorization',
    'Access-Control-Allow-Credentials',
  ],
}));
app.use(cookieParser());
app.use(express.json());
app.use(UsersRoutes);
app.use(validateUserSession);
app.use(FormatterRoutes);
app.use(ExamsRoutes);
app.use(ExamsResultsViews);
app.use(PatientsRoutes);
app.use(PatientResultsRoutes);

app.listen(3333, () => console.log('Servidor rodando na porta 3333'));