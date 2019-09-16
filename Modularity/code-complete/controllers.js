const {
  randomPair
} = require('./middleware');
const {
  readStudentData,
  persistStudentData
} = require('./utils');

let studentFile = "students.txt";
let students = readStudentData(studentFile);

const getPair = (req, res, next) => {
  randomPair(req, res, next, students);
  res.send(req.pair);
}

const addStudent = (req, res) => {
  // Add the student to the array, save to the file,  and send back the updated list of students
  students.push(req.body.name);
  persistStudentData(studentFile, students);
  res.status(201)
  res.send(students);
}

const getStudents = (req, res) => {
  res.send(students);
}

module.exports = {
  addStudent,
  getPair,
  getStudents
};