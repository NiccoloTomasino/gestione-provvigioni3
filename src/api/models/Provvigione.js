const mongoose = require('mongoose');

const ProvvigioneSchema = new mongoose.Schema({
  agente: {
    type: String,
    required: true
  },
  cliente: {
    type: String,
    required: true
  },
  importo: {
    type: Number,
    required: true
  },
  data: {
    type: Date,
    default: Date.now
  },
  stato: {
    type: String,
    enum: ['pagata', 'non pagata', 'parziale'],
    default: 'non pagata'
  },
  note: {
    type: String
  }
}, { timestamps: true });

// Verifica se il modello è già stato compilato per evitare errori
module.exports = mongoose.models.Provvigione || mongoose.model('Provvigione', ProvvigioneSchema);
