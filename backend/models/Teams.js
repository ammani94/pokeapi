const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: { type: String, required:true },
  user_id: { type: String, required:true } 
});

const Teams = mongoose.model('teams', userSchema);

module.exports = Teams;
