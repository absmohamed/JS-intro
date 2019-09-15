const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

// use cors if we want to play with a client
app.use(cors());

// File handling for our persisted data
const fs = require('fs');

const readStudentData = (file) => {
  let students = fs.readFileSync(file, 'utf8').split('\n');
  return students;
};

const persistStudentData = (file, students) => {
  fs.writeFileSync(file, students.join('\n'));
  console.log("updated students:", students)
  return students;
};

// Initialise students
let students = [];
students = readStudentData('students.txt');

// custom middleware
function logReqBody(req, res, next) {
  console.log(req.body);
  next();
}

function randomPair(req, res, next) {
  let s1Ind = Math.floor(Math.random() * students.length);
  let s2Ind = Math.floor(Math.random() * students.length);
  req.pair = {
    pair: [students[s1Ind], students[s2Ind]]
  };
  next();
}

// parse application/json
app.use(bodyParser.json());

// route handling
app.get("/", randomPair, (req, res) => {
  res.send(req.pair);
});

app.get("/students", logReqBody, (req, res) => {
  console.log("sending students", students);
  res.send(students);
});

app.post("/students", logReqBody, (req, res) => {
  // console.log("req.body", req.body);
  // Add the student to the array and send back the updated list of students
  console.log("got student", req.body.name);
  students.push(req.body.name);
  persistStudentData("students.txt", students);
  res.status(201)
  res.send(students);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));