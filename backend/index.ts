const express = require('express');
const cors = require('cors');

const app = express();

// Config JSON response
app.use(express.json());

// Define as origens permitidas
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];

// Configura o CORS para permitir múltiplas origens
app.use(cors({
  credentials: true,
  origin: function (origin: string, callback: (arg0: Error | null, arg1: boolean) => any) {
    // Permite requisições sem origem (como de aplicativos móveis ou curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

// Public folder for images
app.use(express.static('public'));

// Routes
const PetRoutes = require('./routes/PetRoutes');
const UserRoutes = require('./routes/UserRoutes');

app.use('/pets', PetRoutes);
app.use('/users', UserRoutes);

app.listen(5000, () => {
  console.log('Servidor rodando na porta 5000');
});
