const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  api_id: { type: String, required:true },
  user_id: { type: String, required:true },
  captured_at: { type: Date, default:Date.now },
});

const Pokemons = mongoose.model('pokemons', userSchema);

module.exports = Pokemons;
