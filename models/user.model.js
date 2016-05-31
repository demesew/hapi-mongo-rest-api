const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  favoriteMonsters: {
    type: Array,
    required: false,
    default: []
  }
}, {
  timestamps: true
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
