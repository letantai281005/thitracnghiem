// backend/routes/attempts.js (updated)
const express = require('express');
const { db } = require('../models');
const { verifyToken } = require('./auth');

const router = express.Router();

// Submit attempt (protected) – unchanged
router.post('/', verifyToken, (req, res, next) => {
  const {
    exam_id,
    time_spent,
    correct_count,
    total_questions,
    score_percentage,
    passed,
    user_answers,
    flagged_questions,
    cheating_count
  } = req.body;

  const attemptId = `attempt-${Date.now()}`;
  db.run(
    `INSERT INTO attempts (id, username, exam_id, taken_at, time_spent, correct_count,
      total_questions, score_percentage, passed, user_answers, flagged_questions, cheating_count)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      attemptId,
      req.user.username,
      exam_id,
      new Date().toISOString(),
      time_spent,
      correct_count,
      total_questions,
      score_percentage,
      passed ? 1 : 0,
      JSON.stringify(user_answers),
      JSON.stringify(flagged_questions),
      cheating_count
    ],
    function (err) {
      if (err) return next(err);
      res.json({ success: true, attemptId });
    }
  );
});

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

// Get a single attempt by its ID (used for result page)
router.get('/:attemptId', verifyToken, (req, res, next) => {
  const attemptId = req.params.attemptId;
  db.get(`SELECT * FROM attempts WHERE id = ?`, [attemptId], (err, row) => {
    if (err) return next(err);
    if (!row) return res.status(404).json({ error: 'Attempt not found' });
    row.user_answers = JSON.parse(row.user_answers);
    row.flagged_questions = JSON.parse(row.flagged_questions);
    res.json(row);
  });
});

module.exports = router;
