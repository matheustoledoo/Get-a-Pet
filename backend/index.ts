import express from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());

// Configuração do CORS para permitir múltiplas origens
app.use(cors({
  credentials: true,
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Permite requisições sem origem definida (como apps móveis ou requests curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'A política de CORS para este site não permite acesso da origem especificada.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(express.static('public'));

// Rotas
const PetRoutes = require('./routes/PetRoutes');
const UserRoutes = require('./routes/UserRoutes');

app.use('/pets', PetRoutes); // Rota para operações relacionadas a animais de estimação
app.use('/users', UserRoutes); // Rota para operações relacionadas a usuários

const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];

// Iniciando o servidor na porta 5000
app.listen(5000, () => {
  console.log('Servidor rodando na porta 5000');
});
