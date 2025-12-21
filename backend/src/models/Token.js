const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    unique: true 
  },
  tokens: { 
    type: Object, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Token', TokenSchema);