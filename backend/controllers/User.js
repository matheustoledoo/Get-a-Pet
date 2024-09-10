const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Funções auxiliares
const getUserByToken = require('../helpers/get-user-by-token');
const getToken = require('../helpers/get-token');
const createUserToken = require('../helpers/create-user-token');
const { imageUpload } = require('../helpers/image-upload');

module.exports = class UserController {
  // Registro de um novo usuário
  static async register(req, res) {
    const { name, email, phone, password, confirmpassword } = req.body;

    // Verificações iniciais
    if (!name) return res.status(422).json({ message: 'Nome é obrigatório!' });
    if (!email) return res.status(422).json({ message: 'E-mail é obrigatório!' });
    if (!phone) return res.status(422).json({ message: 'Telefone é obrigatório!' });
    if (!password) return res.status(422).json({ message: 'Senha é obrigatória!' });
    if (!confirmpassword) return res.status(422).json({ message: 'Confirmação de senha é obrigatória!' });
    if (password !== confirmpassword) return res.status(422).json({ message: 'As senhas não conferem!' });

    // Verifica se o usuário já está registrado
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(422).json({ message: 'E-mail já está em uso!' });

    // Criação do hash da senha
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Criação do novo usuário
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    try {
      const savedUser = await newUser.save();
      await createUserToken(savedUser, req, res);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Login do usuário
  static async login(req, res) {
    const { email, password } = req.body;

    // Verificações iniciais
    if (!email) return res.status(422).json({ message: 'E-mail é obrigatório!' });
    if (!password) return res.status(422).json({ message: 'Senha é obrigatória!' });

    // Verifica se o usuário existe
    const user = await User.findOne({ email });
    if (!user) return res.status(422).json({ message: 'Usuário não encontrado!' });

    // Verifica a senha
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(422).json({ message: 'Senha inválida!' });

    await createUserToken(user, req, res);
  }

  // Verificação de usuário autenticado
  static async checkUser(req, res) {
    let currentUser = null;

    if (req.headers.authorization) {
      const token = getToken(req);
      const decoded = jwt.verify(token, 'nossosecret');
      currentUser = await User.findById(decoded.id).select('-password');
    }

    res.status(200).json(currentUser);
  }

  // Obtém usuário por ID
  static async getUserById(req, res) {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(422).json({ message: 'Usuário não encontrado!' });

    res.status(200).json(user);
  }

  // Edição de usuário
  static async editUser(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    const { name, email, phone, password, confirmpassword } = req.body;

    // Atualização da imagem
    if (req.file) {
      user.image = req.file.filename;
    }

    // Validações e atualizações de dados do usuário
    if (!name) return res.status(422).json({ message: 'Nome é obrigatório!' });
    user.name = name;

    if (!email) return res.status(422).json({ message: 'E-mail é obrigatório!' });
    const emailExists = await User.findOne({ email });
    if (email !== user.email && emailExists) return res.status(422).json({ message: 'E-mail já está em uso!' });
    user.email = email;

    if (!phone) return res.status(422).json({ message: 'Telefone é obrigatório!' });
    user.phone = phone;

    if (password && password === confirmpassword) {
      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(password, salt);
    } else if (password !== confirmpassword) {
      return res.status(422).json({ message: 'As senhas não conferem!' });
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(user._id, user, { new: true });
      res.status(200).json({ message: 'Usuário atualizado com sucesso!', data: updatedUser });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};
