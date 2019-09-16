const fs = require('fs');

// Read student data from a file
const readStudentData = file => {
  let students = fs.readFileSync(file, 'utf8').split('\n');
  return students;
};

// Write student data to a file
const persistStudentData = (file, students) => {
  fs.writeFileSync(file, students.join('\n'));
  return students;
};

module.exports = {
  readStudentData,
  persistStudentData
}