const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  api_id: { type: String, required:true },
  user_id: { type: String, required:true },
  captured_at: { type: Date, default:Date.now },
  team_id: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
});

const Pokemons = mongoose.model('pokemons', userSchema);

module.exports = Pokemons;
