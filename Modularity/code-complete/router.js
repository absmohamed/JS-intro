const express = require('express');
const router = express.Router();
const {
  logReqBody
} = require('./middleware');
const {
  addStudent,
  getPair,
  getStudents
} = require('./controllers');

router.get('/', getPair);
router.get('/students', getStudents);
router.post('/students', logReqBody, addStudent);

module.exports = router;