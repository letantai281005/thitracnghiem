const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db, run } = require('../models');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

// ----- Register -----
router.post('/register', async (req, res, next) => {
  try {
    const { username, password, name, role, avatar, studentType } = req.body;
    const password_hash = await bcrypt.hash(password, 10);
    await run(
      `INSERT INTO users (username,password_hash,name,role,avatar,student_type)
       VALUES (?,?,?,?,?,?)`,
      [username, password_hash, name, role, avatar, studentType]
    );
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

// ----- Login -----
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, row) => {
      if (err) return next(err);
      if (!row) return res.status(401).json({ error: 'Invalid credentials' });

      const valid = await bcrypt.compare(password, row.password_hash);
      if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

      const token = jwt.sign(
        { username: row.username, role: row.role, name: row.name, avatar: row.avatar, student_type: row.student_type },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      res.json({ token, user: { username: row.username, name: row.name, role: row.role, avatar: row.avatar, studentType: row.student_type } });
    });
  } catch (e) {
    next(e);
  }
});

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    res.status(403).json({ error: 'Invalid token' });
  }
}

module.exports = router;
module.exports.verifyToken = verifyToken;
