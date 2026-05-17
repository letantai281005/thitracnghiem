const express = require('express');
const { db, run } = require('../models');
const { verifyToken } = require('./auth');
const router = express.Router();

// Teacher creates a room for an exam
router.post('/create', verifyToken, (req, res, next) => {
  const { examId, startTime } = req.body; // startTime in ISO string
  if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Permission denied' });
  }
  if (new Date(startTime) <= new Date()) {
    return res.status(400).json({ error: 'Start time must be in the future' });
  }
  const code = 'R' + Math.random().toString(36).substr(2, 6).toUpperCase();
  db.run(
    `INSERT INTO rooms (code, exam_id, start_time, status) VALUES (?,?,?,?)`,
    [code, examId, startTime, 'pending'],
    function (err) {
      if (err) return next(err);
      res.json({ success: true, code, startTime });
    }
  );
});

// Student joins a room to get info (start time etc.)
router.get('/:code', verifyToken, (req, res, next) => {
  const { code } = req.params;
  db.get(`SELECT * FROM rooms WHERE code = ?`, [code], (err, room) => {
    if (err) return next(err);
    if (!room) return res.status(404).json({ error: 'Room not found' });
    
    const now = new Date();
    const startTime = new Date(room.start_time);
    if (now < startTime) {
      const remainingSeconds = Math.floor((startTime - now) / 1000);
      return res.json({ status: 'waiting', remainingSeconds });
    }
    
    res.json(room);
  });
});

module.exports = router;
