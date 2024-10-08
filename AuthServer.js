const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(bodyParser.json());


const mongoURI = "mongodb+srv://carlisdjandres6:OzcBVqlCnmAIPDgu@cluster0.tuet2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado ao MongoDB Atlas'))
  .catch(err => console.error('Erro ao conectar ao MongoDB Atlas:', err));
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

const User = mongoose.model('User', UserSchema);

app.post('/signup', async (req, res) => {
  const { name, email, password, passwordConfirmation } = req.body;

  if (!name || !email || !password || !passwordConfirmation) {
    return res.status(400).send('Todos os campos são obrigatórios');
  }

  if (password !== passwordConfirmation) {
    return res.status(400).send('As senhas não coincidem');
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { name }] });
    if (existingUser) {
      return res.status(400).send('Usuário ou email já existe');
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).send('Registrado com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao registrar usuário');
  }
});

app.post('/login', async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await User.findOne({ $or: [{ email: name }, { name }] });
    if (!user || user.password !== password) {
      return res.status(401).send('Credenciais inválidas');
    }

    res.send('logado');
  } catch (error) {
    res.status(500).send('Erro ao fazer login');
  }
});

app.get('/name/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).send('Usuário não encontrado');
    }
    res.json({ nome: user.name });
  } catch (error) {
    res.status(500).send('Erro ao buscar usuário');
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Servidor de autenticação rodando na porta ${PORT}`));