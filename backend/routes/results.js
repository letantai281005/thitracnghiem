// backend/routes/results.js
// Returns attempt results for a given exam (student view) and all attempts (admin view)
const express = require('express');
const { db } = require('../models');
const { verifyToken } = require('./auth');

const router = express.Router();

// Get attempts of the logged‑in student for a specific exam
router.get('/my/:examId', verifyToken, (req, res, next) => {
  const examId = req.params.examId;
  db.all(
    `SELECT * FROM attempts WHERE exam_id = ? AND username = ? ORDER BY taken_at DESC`,
    [examId, req.user.username],
    (err, rows) => {
      if (err) return next(err);
      rows.forEach(r => {
        r.user_answers = JSON.parse(r.user_answers);
        r.flagged_questions = JSON.parse(r.flagged_questions);
      });
      res.json(rows);
    }
  );
});

// Admin / teacher view all attempts for an exam
router.get('/exam/:examId', verifyToken, (req, res, next) => {
  const { role } = req.user;
  if (!['admin', 'teacher'].includes(role)) return res.status(403).json({ error: 'Permission denied' });
  const examId = req.params.examId;
  db.all(
    `SELECT * FROM attempts WHERE exam_id = ? ORDER BY taken_at DESC`,
    [examId],
    (err, rows) => {
      if (err) return next(err);
      rows.forEach(r => {
        r.user_answers = JSON.parse(r.user_answers);
        r.flagged_questions = JSON.parse(r.flagged_questions);
      });
      res.json(rows);
    }
  );
});

module.exports = router;
