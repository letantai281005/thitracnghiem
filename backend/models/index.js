const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.join(__dirname, 'db.sqlite');
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) console.error('❌ DB open error:', err);
  else console.log('✅ SQLite DB ready at', DB_PATH);
});

// Helper to run a statement & log errors
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

// Initialise schema (executed on server start)
async function initSchema() {
  // Users
  await run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT CHECK(role IN ('admin','teacher','student')) NOT NULL,
    avatar TEXT,
    student_type TEXT
  )`);

  // Subjects
  await run(`CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
  )`);

  // Exams (questions stored as JSON string)
  await run(`CREATE TABLE IF NOT EXISTS exams (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    subject_id INTEGER REFERENCES subjects(id),
    duration INTEGER NOT NULL,
    pass_score INTEGER NOT NULL,
    start_date TEXT,
    end_date TEXT,
    questions TEXT
  )`);

  // Attempts (results)
  await run(`CREATE TABLE IF NOT EXISTS attempts (
    id TEXT PRIMARY KEY,
    username TEXT REFERENCES users(username),
    exam_id TEXT REFERENCES exams(id),
    taken_at TEXT,
    time_spent INTEGER,
    correct_count INTEGER,
    total_questions INTEGER,
    score_percentage INTEGER,
    passed INTEGER,
    user_answers TEXT,
    flagged_questions TEXT,
    cheating_count INTEGER
  )`);
}

module.exports = {
  db,
  initSchema,
  run
};
