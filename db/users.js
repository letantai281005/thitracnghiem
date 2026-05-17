// db/users.js
// Seed data for user accounts (admin, teacher, students)
const USERS = [
  {
    username: 'admin',
    name: 'Quản trị viên',
    role: 'admin',
    avatar: 'user-shield',
    studentType: 'học sinh'
  },
  {
    username: 'teacher1',
    name: 'Giảng viên A',
    role: 'teacher',
    avatar: 'chalkboard-teacher',
    studentType: 'giáo viên'
  },
  {
    username: 'student1',
    name: 'Nguyễn Văn A',
    role: 'student',
    avatar: 'user-graduate',
    studentType: 'học sinh'
  }
];

// Export for import in other modules (if using module system)
if (typeof module !== 'undefined') {
  module.exports = { USERS };
}
