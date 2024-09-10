const express = require('express');
const router = express.Router();
const PetController = require('../controllers/Pet');

// Middlewares
const verifyToken = require('../helpers/verify-token');
const { imageUpload } = require('../helpers/image-upload');

// Rota para criação de um novo pet com upload de imagens e verificação de token
router.post(
  '/create',
  verifyToken,
  imageUpload.array('images'), // Permite upload de múltiplas imagens
  PetController.create
);

// Rota para obter todos os pets
router.get('/', PetController.getAll);

// Rota para obter todos os pets do usuário autenticado
router.get('/mypets', verifyToken, PetController.getUserPets);

// Rota para obter todas as adoções feitas pelo usuário autenticado
router.get('/myadoptions', verifyToken, PetController.getUserAdoptions);

// Rota para obter um pet específico pelo ID
router.get('/:id', PetController.getPetById);

// Rota para remover um pet pelo ID com verificação de token
router.delete('/:id', verifyToken, PetController.removePetById);

// Rota para atualizar informações de um pet com upload de novas imagens e verificação de token
router.patch(
  '/:id',
  verifyToken,
  imageUpload.array('images'), // Permite upload de múltiplas imagens
  PetController.updatePet
);

// Rota para agendar uma visita para adoção de um pet com verificação de token
router.patch('/schedule/:id', verifyToken, PetController.schedule);

// Rota para concluir a adoção de um pet com verificação de token
router.patch('/conclude/:id', verifyToken, PetController.concludeAdoption);

module.exports = router;
