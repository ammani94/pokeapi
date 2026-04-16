const mongoose = require('mongoose');
const pokemonSchema = new mongoose.Schema({
  api_id: { type: String, required:true },
  user_id: { type: String, required:true },
  captured_at: { type: Date, default:Date.now },
  team_id: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
});

const Pokemons = mongoose.model('pokemons', pokemonSchema);

pokemonSchema.pre('save', function(next) {
  if (this.team_id) {
    throw new Error('Le pokémon appartient déjà à une équipe');
  }
  next();
});

module.exports = Pokemons;
