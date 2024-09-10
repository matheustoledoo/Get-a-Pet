const jwt = require('jsonwebtoken');
const getToken = require('./get-token');

// Middleware para validar o token JWT
const verifyToken = (req, res, next) => {
  // Verifica se o cabeçalho de autorização está presente
  if (!req.headers.authorization) {
    return res.status(401).json({ message: 'Acesso negado!' });
  }

  // Obtém o token do cabeçalho de autorização
  const token = getToken(req);
  
  // Verifica se o token está presente
  if (!token) {
    return res.status(401).json({ message: 'Acesso negado!' });
  }

  try {
    // Verifica e decodifica o token
    const verified = jwt.verify(token, 'nossosecret');
    
    // Adiciona o usuário verificado ao objeto de requisição
    req.user = verified;
    
    // Continua o fluxo da aplicação
    next();
  } catch (err) {
    // Tratamento de erro para token inválido
    return res.status(400).json({ message: 'Token inválido!' });
  }
};

module.exports = verifyToken;
