
const { randomPair } = require('./middleware');
const { readStudentData, persistStudentData } = require('./utils')
// Initialize our array of students

let students = [];
students = readStudentData('students.txt');

// Gets a random pair of students using the randomPair middleware
const getPair = (req, res, next) => {
    randomPair(req, res, next, students);
    res.send(req.pair);
}
  
  // Adds a student to the array and persists it in the file
const addStudent = (req, res) => {
    // Add the student to the array, save to the file,  and send back the updated list of students
    students.push(req.body.name);
    persistStudentData('students.txt', students);
    res.status(201)
    res.send(students);
}
  
  // Returns the list of students
const getStudents = (req, res) => {
    res.send(students);
}

module.exports = { addStudent, getPair, getStudents };