const express = require("express");

const app = express();
const port = 3000;

const fs = require('fs');

const readStudentData = file => {
	let students = fs.readFileSync(file, "utf8").split("\n")
	return students
}

const persistStudentData = (file, students) => {
	fs.writeFileSync(file, students.join("\n"))
	console.log("updated students:", students)
	return students
}

function randomPair() {
	let s1Ind = Math.floor(Math.random() * students.length)
	let s2Ind = Math.floor(Math.random() * students.length)
	// Return a JSON object with an array
	return {
		pair: [students[s1Ind], students[s2Ind]]
	}
}

let students = []

students = readStudentData("students.txt") 

app.get("/", (req, res) => {
	res.send(randomPair())
})

app.get("/students", (req, res) => {
	res.send(students)
})

app.post("/students", (req, res) => {
	console.log(req);
	// Still need to add code to add the student that is sent
	res.send(students)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
