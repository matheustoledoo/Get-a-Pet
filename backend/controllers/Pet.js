const Pet = require('../models/Pet');

// Funções auxiliares
const getUserByToken = require('../helpers/get-user-by-token');
const getToken = require('../helpers/get-token');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = class PetController {
  // Adiciona um novo pet
  static async create(req, res) {
    const { name, age, description, weight, color } = req.body;
    const images = req.files;

    // Validações de campo
    if (!name) return res.status(422).json({ message: 'O nome é obrigatório!' });
    if (!age) return res.status(422).json({ message: 'A idade é obrigatória!' });
    if (!weight) return res.status(422).json({ message: 'O peso é obrigatório!' });
    if (!color) return res.status(422).json({ message: 'A cor é obrigatória!' });
    if (!images) return res.status(422).json({ message: 'A imagem é obrigatória!' });

    try {
      // Obter usuário
      const token = getToken(req);
      const user = await getUserByToken(token);

      // Criar novo pet
      const pet = new Pet({
        name,
        age,
        description,
        weight,
        color,
        available: true,
        images: images.map(image => image.filename),
        user: {
          _id: user._id,
          name: user.name,
          image: user.image,
          phone: user.phone,
        },
      });

      const newPet = await pet.save();
      res.status(201).json({
        message: 'Pet cadastrado com sucesso!',
        pet: newPet,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Obtém todos os pets cadastrados
  static async getAll(req, res) {
    try {
      const pets = await Pet.find().sort('-createdAt');
      res.status(200).json({ pets });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Obtém todos os pets do usuário
  static async getUserPets(req, res) {
    try {
      const token = getToken(req);
      const user = await getUserByToken(token);
      const pets = await Pet.find({ 'user._id': user._id });
      res.status(200).json({ pets });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Obtém todas as adoções feitas pelo usuário
  static async getUserAdoptions(req, res) {
    try {
      const token = getToken(req);
      const user = await getUserByToken(token);
      const pets = await Pet.find({ 'adopter._id': user._id });
      res.status(200).json({ pets });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Obtém detalhes de um pet específico
  static async getPetById(req, res) {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(422).json({ message: 'ID inválido!' });
    }

    try {
      const pet = await Pet.findById(id);
      if (!pet) {
        return res.status(404).json({ message: 'Pet não encontrado!' });
      }
      res.status(200).json({ pet });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Remove um pet pelo ID
  static async removePetById(req, res) {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(422).json({ message: 'ID inválido!' });
    }

    try {
      const pet = await Pet.findById(id);
      if (!pet) {
        return res.status(404).json({ message: 'Pet não encontrado!' });
      }

      const token = getToken(req);
      const user = await getUserByToken(token);
      if (pet.user._id.toString() !== user._id.toString()) {
        return res.status(403).json({ message: 'Ação não permitida!' });
      }

      await Pet.findByIdAndDelete(id);
      res.status(200).json({ message: 'Pet removido com sucesso!' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Atualiza informações de um pet
  static async updatePet(req, res) {
    const { id } = req.params;
    const { name, age, description, weight, color, available } = req.body;
    const images = req.files;

    if (!ObjectId.isValid(id)) {
      return res.status(422).json({ message: 'ID inválido!' });
    }

    try {
      const pet = await Pet.findById(id);
      if (!pet) {
        return res.status(404).json({ message: 'Pet não encontrado!' });
      }

      const token = getToken(req);
      const user = await getUserByToken(token);
      if (pet.user._id.toString() !== user._id.toString()) {
        return res.status(403).json({ message: 'Ação não permitida!' });
      }

      // Atualizações de campos
      if (name) pet.name = name;
      if (age) pet.age = age;
      if (weight) pet.weight = weight;
      if (color) pet.color = color;
      if (available !== undefined) pet.available = available;
      if (description) pet.description = description;
      if (images) pet.images = images.map(image => image.filename);

      await pet.save();
      res.status(200).json({ message: 'Pet atualizado com sucesso!', pet });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Agenda uma visita para adoção
  static async schedule(req, res) {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(422).json({ message: 'ID inválido!' });
    }

    try {
      const pet = await Pet.findById(id);
      if (!pet) {
        return res.status(404).json({ message: 'Pet não encontrado!' });
      }

      const token = getToken(req);
      const user = await getUserByToken(token);
      if (pet.user._id.equals(user._id)) {
        return res.status(422).json({ message: 'Você não pode agendar uma visita com seu próprio Pet!' });
      }

      if (pet.adopter && pet.adopter._id.equals(user._id)) {
        return res.status(422).json({ message: 'Você já agendou uma visita para este Pet!' });
      }

      pet.adopter = {
        _id: user._id,
        name: user.name,
        image: user.image,
      };

      await pet.save();
      res.status(200).json({
        message: `Visita agendada com sucesso! Entre em contato com ${pet.user.name} pelo telefone: ${pet.user.phone}`,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Conclui a adoção de um pet
  static async concludeAdoption(req, res) {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(422).json({ message: 'ID inválido!' });
    }

    try {
      const pet = await Pet.findById(id);
      if (!pet) {
        return res.status(404).json({ message: 'Pet não encontrado!' });
      }

      pet.available = false;
      await pet.save();
      res.status(200).json({
        message: 'Parabéns! Adoção concluída com sucesso!',
        pet,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};
