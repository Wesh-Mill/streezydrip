require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// Route de test
app.get('/api/test', (req, res) => {
    res.json({ message: 'Serveur Streezy Drip est actif!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Serveur Streezy Drip lancé sur http://localhost:${PORT}`);
});
