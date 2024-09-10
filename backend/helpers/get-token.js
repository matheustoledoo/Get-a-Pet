// Função para obter o token a partir do cabeçalho da requisição
const getToken = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new Error('Cabeçalho de autorização não encontrado!');
  }

  // Extrai o token do cabeçalho
  const token = authHeader.split(' ')[1];
  
  return token;
};

module.exports = getToken;
