let students = [];
let serverUrl = "http://localhost:3000/";

let studentsUrl = serverUrl + "students";

function getStudentList() {
  fetch(studentsUrl)
    .then((response) => {
      if (response.status !== 200) {
        console.log("There was a problem on the server. Response status is:", response.status);
        return;
      }
      console.log("got response from server:", response.body)
      // Parse the response
      response.json().then(jsonCallback);
    }).catch(err => console.log(err));
}

function displayStudentList(students) {
  let section = document.querySelector("#student-list");
  section.innerHTML = null;
  let h1 = document.createElement("h1");
  h1.textContent = "Student List";
  let ul = document.createElement("ul");
  for (let student of students) {
    let li = document.createElement("li");
    li.textContent = student;
    ul.appendChild(li);
  }
  section.appendChild(h1);
  section.appendChild(ul);
}

function jsonCallback(response) {
  console.log("parsed body", response)
  displayStudentList(response);
}

function postNewStudent(event) {
  event.preventDefault();
  let student = event.target.elements[0].value;
  console.log("student", student)
  let options = {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({
      "name": student
    })
  };
  fetch(studentsUrl, options).then((response) => {
    if (response.status !== 201) {
      console.log("There was a problem on the server:", response.status);
    }
    console.log("Added student");
    response.json().then(jsonCallback)
  }).catch((err) => console.log(err));
}

function getPair(event) {
  event.preventDefault();
  fetch(serverUrl).then((response) => {
    if (response.status !== 200) {
      console.log("There was a problem on the server. Response status is:", response.status);
      return;
    }
    // Parse the response
    response.json().then((body) => {
      displayPair(body.pair);
    });
  })
}

function displayPair(pair) {
  let pairSection = document.getElementById("student-pair");
  pairSection.innerHTML = null;
  let h1 = document.createElement("h1");
  h1.textContent = "Student pair";
  let p1 = document.createElement("p");
  p1.textContent = pair[0];
  let p2 = document.createElement("p");
  p2.textContent = pair[1];
  pairSection.appendChild(h1);
  pairSection.appendChild(p1);
  pairSection.appendChild(p2);
}

getStudentList();
let newStudentForm = document.getElementById("add-student-form");
newStudentForm.addEventListener("submit", postNewStudent);

let getPairButton = document.getElementById("show-pair");
getPairButton.addEventListener("click", getPair);