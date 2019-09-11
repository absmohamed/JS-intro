const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

const students = ["Natasha", "Shakti", "Santosh", "Allen", "James", "Blake"];

// custom middleware with a message
function logReqBody(req, res, next) {
  console.log(req.body);
  next("message from middleware");
}

// parse application/json
app.use(bodyParser.json());


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/students", (req, res) => {
  res.send(students);
})

app.post("/students", logReqBody, (req, res, message) => {
  // console.log("req.body", req.body);
  // Add the student to the array and send back the updated list of students
  console.log(message);
  students.push(req.body.name);
  res.status(201)
  res.send(students);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));