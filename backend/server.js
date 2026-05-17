require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
// app.use('/api/exams', require('./routes/exams')); // If this route exists
app.use('/api/attempts', require('./routes/attempts'));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 4000;
db.initSchema().then(() => {
    app.listen(PORT, () => console.log(`✅ Backend listening on http://localhost:${PORT}`));
}).catch(err => {
    console.error('Failed to init DB schema', err);
});
