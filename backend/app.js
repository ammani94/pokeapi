const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Pokemons = require('./models/Pokemons');
const Teams = require('./models/Teams');
dotenv.config();
const session = require('express-session');

const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(session({
  secret: '6MX9u2rEU2rdqdMsoytC',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: 'lax',
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
      return res.status(200).json({ message: 'Connexion échouée', success: false });
    }

    const isMatched = await user.comparePassword(password);
    if (!isMatched) {
      return res.status(200).json({ message: 'Connexion échouée', success: false });
    }
    res.setHeader('Content-Type', 'text/html')
    req.session.userId = user._id;
    req.session.email = user.email;
    req.session.save(function (err) {
      if (err) {
        console.error('Erreur lors de la sauvegarde de la session :', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      res.status(200).json({ message: 'Connexion réussie', success: true, user:req.session });
    })

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
        res.status(200).json({ success: false, message: 'Erreur lors de la récupération des données' });
      }
      res.status(201).json({ success: true, user: req.session });

  } catch (err) {
    console.error('Erreur :', err);
    res.status(500).json({ message: 'Erreur lors de la récupération des données' });
  }
});

app.post('/catch', async (req, res) => {
  try {
        const { api_id, name, userId } = req.body;
        let currendate = new Date()
        const user_id = userId
        let captured_at = currendate.toLocaleDateString()
        const newPokemon = new Pokemons({ api_id, user_id, captured_at });
        await newPokemon.save();
        res.status(201).json({
          success: true,
          message: 'Pokémon ajouté'
        });
  } catch (err) {
    console.error('Erreur :', err);
    res.status(500).json({ message: 'Erreur lors de l\'ajout du pokemon' });
  }
});


app.post('/fetch', async (req, res) => {
  try {
        let userId = req.body.user_id
        const PokemonsCaught = await Pokemons.find({ user_id : userId, team_id : null })
        res.status(201).json({
          success: true,
          results: PokemonsCaught
        });
      } catch (err) {
    console.error('Erreur :', err);
    res.status(500).json({ message: 'Erreur lors de l\'ajout du pokemon' });
  }
});

app.post('/fetch/team/:teamId', async (req, res) => {
  try {
        let userId = req.body.user_id
        const team_id  = req.params.teamId;
        const PokemonsCaught = await Pokemons.find({ user_id : userId, team_id : team_id })
        res.status(201).json({
          success: true,
          results: PokemonsCaught
        });
      } catch (err) {
    console.error('Erreur :', err);
    res.status(500).json({ message: 'Erreur lors de l\'ajout du pokemon' });
  }
});


app.post('/free/:pokemon_id', async (req, res) => {
  try {
        let userId = req.body.user_id
        const { pokemon_id } = req.params;
        let pokemon = await Pokemons.findById(pokemon_id);
        if (pokemon.team_id) {
          await Teams.delete()
        }
        const PokemonsCaught = await Pokemons.find({ user_id : userId })
        res.status(201).json({
          success: true,
          results: PokemonsCaught
        });
      } catch (err) {
    console.error('Erreur :', err);
    res.status(500).json({ message: 'Erreur lors de la suppression du pokemon' });
  }
});

app.post('/create_team', async (req, res) => {
  try {
        const { name, user_id } = req.body;
        const newTeam = new Teams({ name, user_id });
        await newTeam.save(); 
        res.status(201).json({
          success: true,
          message: 'Équipe créee'
        });
      } catch (err) {
    console.error('Erreur :', err);
    res.status(500).json({ message: 'Erreur lors de la création de l\'équipe' });
  }
});

app.post('/fetchTeams', async (req, res) => {
  try {
        let userId = req.body.user_id
        const teams = await Teams.find({ user_id : userId })
        res.status(201).json({
          success: true,
          results: teams
        });
      } catch (err) {
    console.error('Erreur :', err);
    res.status(500).json({ message: 'Erreur lors de la création de l\'équipe' });
  }
});

app.post('/:teamId/pokemons/:pokemonId', async (req, res) => {
  try {
        const { teamId, pokemonId } = req.params;
        let userId = req.body.user_id;

        let pokemon = await Pokemons.findById(pokemonId);
        if (!pokemon) {
          res.status(404).json({ message: 'Pokemon non trouvé' });
        }

        if (pokemon.team_id) {
          res.status(400).json({ message: 'Pokemon déjà dans une équipe' });
        }

        let team = await Teams.findById(teamId);
        if (!team) {
          res.status(404).json({ message: 'Équipe non trouvé' });
        }

        pokemon.team_id = teamId;
        await pokemon.save();

        team.pokemons.push(pokemonId);
        await team.save();

        res.status(200).json({message: 'Pokémon ajouté dans l\'équipe'});

      } catch (err) {
    console.error('Erreur :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.post('/pokemons/:pokemonId', async (req, res) => {
  try {
        const { pokemonId } = req.params;

        let pokemon = await Pokemons.findById(pokemonId);
        if (!pokemon) {
          res.status(404).json({ message: 'Pokemon non trouvé' });
        }

        pokemon.team_id = null;
        await pokemon.save();

        let userId = req.body.user_id
        const PokemonsCaught = await Pokemons.find({ user_id : userId, team_id : null })
        res.status(201).json({
          success: true,
          results: PokemonsCaught
        });

      } catch (err) {
    console.error('Erreur :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = app;
