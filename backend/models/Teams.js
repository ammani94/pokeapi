const mongoose = require('mongoose');
const teamSchema = new mongoose.Schema({
  name: { type: String, required:true },
  user_id: { type: String, required:true },
  pokemons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pokemons',
  }],
});

const Teams = mongoose.model('teams', teamSchema);

teamSchema.pre('save', function(next) {
  if (this.pokemons.length == 6) {
    throw new Error('Une équipe ne peut contenir que 6 Pokémon maximum.');
  }
  next();
});

module.exports = Teams;
