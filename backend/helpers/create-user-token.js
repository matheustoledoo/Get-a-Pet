const jwt = require('jsonwebtoken');

// Função para criar um token JWT para o usuário
const createUserToken = async (user, req, res) => {
  // Criação do token JWT com dados do payload
  const token = jwt.sign(
    {
      name: user.name,
      id: user._id,
    },
    'nossosecret',
    {
      expiresIn: '1d', // Define a expiração do token para 1 dia
    }
  );

  // Retorna o token e informações do usuário na resposta
  res.status(200).json({
    message: 'Autenticação bem-sucedida!',
    token: token,
    userId: user._id,
  });
};

module.exports = createUserToken;
