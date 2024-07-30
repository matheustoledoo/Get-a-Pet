"use strict";
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];
app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));
app.use(express.static('public'));
const PetRoutes = require('./routes/PetRoutes');
const UserRoutes = require('./routes/UserRoutes');
app.use('/pets', PetRoutes);
app.use('/users', UserRoutes);
app.listen(5000, () => {
    console.log('Servidor rodando na porta 5000');
});
