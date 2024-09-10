const multer = require('multer');
const path = require('path');

// Configuração de armazenamento para upload de imagens
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Verifica o tipo de entidade (pets ou users) para definir o caminho correto
    if (req.baseUrl.includes('pets')) {
      cb(null, 'public/images/pets');
    } else if (req.baseUrl.includes('users')) {
      cb(null, 'public/images/users');
    } else {
      cb(null, 'public/images');
    }
  },
  filename: function (req, file, cb) {
    // Mantém o nome único para cada arquivo
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Função de filtro para verificar o tipo de arquivo
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Tipo de arquivo não suportado!'), false);
  }
  cb(null, true);
};

// Configuração do upload de imagens usando multer
const imageUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = { imageUpload };
