import express from 'express';
import { 
  ExamsRoutes, 
  FormatterRoutes, 
  UsersRoutes 
} from './Views';
import cookieParser from 'cookie-parser'


const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(UsersRoutes);
app.use(FormatterRoutes);
app.use(ExamsRoutes);

app.listen(3333, () => console.log('Servidor rodando na porta 3333'));