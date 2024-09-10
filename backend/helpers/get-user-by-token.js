const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Função para obter um usuário autenticado a partir do token
const getUserByToken = async (token) => {
  if (!token) {
    throw new Error('Token não fornecido!');
  }

  // Decodifica o token para obter o ID do usuário
  const decoded = jwt.verify(token, 'nossosecret');
  const userId = decoded.id;

  // Busca o usuário no banco de dados pelo ID
  const user = await User.findById(userId);

  // Retorna o usuário sem a senha
  return user;
};

module.exports = getUserByToken;
