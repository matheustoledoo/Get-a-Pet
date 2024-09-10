const express = require('express');
const router = express.Router();

const UserController = require('../controllers/User');

// Middlewares
const verifyToken = require('../helpers/verify-token');
const { imageUpload } = require('../helpers/image-upload');

// Rota para registrar um novo usuário
router.post('/register', UserController.register);

// Rota para login de um usuário
router.post('/login', UserController.login);

// Rota para checar o usuário autenticado
router.get('/checkuser', UserController.checkUser);

// Rota para obter um usuário pelo ID
router.get('/:id', UserController.getUserById);

// Rota protegida para editar os dados de um usuário
router.patch('/edit/:id', verifyToken, imageUpload.single('image'), UserController.editUser);

module.exports = router;
