const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
dotenv.config();
const session = require('express-session');

const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(session({
  secret: '6MX9u2rEU2rdqdMsoytC',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connecté à MongoDB !'))
  .catch(err => console.error('Erreur de connexion à MongoDB :', err));


app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ message: 'Un utilisateur avec cet email existe déjà.' });
    }

    const newUser = new User({ email, password });
    await newUser.save();

    res.status(201).json({
      message: 'Utilisateur créé avec succès !',
      user: { id: newUser._id, email: newUser.email }
    });
  } catch (err) {
    console.error('Erreur lors de l\'enregistrement :', err);
    res.status(500).json({ message: 'Erreur serveur lors de l\'enregistrement.' });
  }
});

app.post('/signin', async (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Connexion échouée', success: false });
    }

    const isMatched = await user.comparePassword(password);
    if (!isMatched) {
      return res.status(401).json({ message: 'Connexion échouée', success: false });
    }

    req.session.userId = user._id;
    req.session.email = user.email;
    res.status(200).json({ message: 'Connexion réussie', success: true });

  } catch (err) {
    console.error('Erreur lors de la connexion :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.post('/logout', async (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de la déconnexion.' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Déconnexion réussie.', success: true });
  });
});

app.post('/session', async (req, res) => {
  try {
      if (!req.session.userId) {
        res.status(401).json({ success: false, message: 'Erreur lors de la récupération des données' });
      }
      res.status(201).json({ success: true, user: req.session });

  } catch (err) {
    console.error('Erreur :', err);
    res.status(500).json({ message: 'Erreur lors de la récupération des données' });
  }
});

module.exports = app;
