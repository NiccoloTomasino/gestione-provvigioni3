const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Carica le variabili d'ambiente
dotenv.config();

// Inizializza Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connessione a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connesso con successo'))
  .catch(err => {
    console.error('Errore di connessione a MongoDB:', err.message);
    process.exit(1);
  });

// Definizione del modello
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

const Provvigione = mongoose.model('Provvigione', ProvvigioneSchema);

// Routes API
app.get('/api/provvigioni', async (req, res) => {
  try {
    const provvigioni = await Provvigione.find().sort({ data: -1 });
    res.json(provvigioni);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Errore del server');
  }
});

app.post('/api/provvigioni', async (req, res) => {
  try {
    const nuovaProvvigione = new Provvigione(req.body);
    const provvigione = await nuovaProvvigione.save();
    res.json(provvigione);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Errore del server');
  }
});

app.get('/api/provvigioni/:id', async (req, res) => {
  try {
    const provvigione = await Provvigione.findById(req.params.id);
    if (!provvigione) {
      return res.status(404).json({ msg: 'Provvigione non trovata' });
    }
    res.json(provvigione);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Provvigione non trovata' });
    }
    res.status(500).send('Errore del server');
  }
});

app.put('/api/provvigioni/:id', async (req, res) => {
  try {
    const provvigione = await Provvigione.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!provvigione) {
      return res.status(404).json({ msg: 'Provvigione non trovata' });
    }
    res.json(provvigione);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Errore del server');
  }
});

app.delete('/api/provvigioni/:id', async (req, res) => {
  try {
    const provvigione = await Provvigione.findByIdAndDelete(req.params.id);
    if (!provvigione) {
      return res.status(404).json({ msg: 'Provvigione non trovata' });
    }
    res.json({ msg: 'Provvigione eliminata' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Errore del server');
  }
});

// Avvia il server
app.listen(PORT, () => console.log(`Server avviato sulla porta ${PORT}`));
