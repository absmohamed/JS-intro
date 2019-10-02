let serverUrl = "http://localhost:3000/"
let studentsUrl = serverUrl + "students"

function jsonCallback(response) {
	console.log("parsed body", response)
	displayStudentList(response)
}

function displayStudentList(students) {
    let section = document.querySelector("#student-list")
    section.innerHTML = null;
	let h1 = document.createElement("h1")
	h1.textContent = "Student List"
	let ul = document.createElement("ul")
	for (let student of students) {
		let li = document.createElement("li")
		li.textContent = student
		ul.appendChild(li)
	}
	section.appendChild(h1)
	section.appendChild(ul)
}

function getStudentList() {
	fetch(studentsUrl)
		.then(response => {
            if (response.status !== 200) {
            console.log("Got an error from the server:", response.status)
            return}
            console.log("got response from server:", response.body)
            // Parse the response
			response.json().then(jsonCallback)
        })
		.catch(err => console.log(err))
}

function postNewStudent(event) {
	event.preventDefault()
	let textField = event.target.elements[0]
	let student = textField.value
    console.log("student", student)
    let options = {
		method: "POST",
		headers: {
			"Content-type": "application/json"
		},
		body: JSON.stringify({
			name: student
		})
    }
    
    fetch(studentsUrl, options)
	.then(response => {
		if (response.status !== 201) {
			console.log("There was a problem on the server:", response.status)
		}
		console.log("Added student")
		// Clear the text field
		textField.value = ""
		response.json().then(jsonCallback)
	})
	.catch(err => console.log(err))
}

getStudentList();

function displayPair(pair) {
    let gettingPairSection = document.getElementById("student-pair")
    gettingPairSection.innerHTML = null;
    let h1 = document.createElement("h1");
    h1.textContent = "Showing Pair of students";
    let p1 = document.createElement("p1");
    p1.textContent = pair[0];
    let p2 = document.createElement("p2");
    p2.textContent = pair[1];
    gettingPairSection.appendChild(h1);
    gettingPairSection.appendChild(p1);
    gettingPairSection.appendChild(p2);
}

function getPair(event) {
    event.preventDefault()
    fetch(serverUrl)
		.then(response => {
            if (response.status !== 200) {
            console.log("Got an error from the server:", response.status)
            return}
            console.log("got response from server:", response.body)
            // Parse the response
			response.json().then((body) => {
                displayPair(body.pair);
            });
    })
}

 
let newStudentForm = document.getElementById("add-student-form")
newStudentForm.addEventListener("submit", postNewStudent)

let showNewPair = document.getElementById("show-pair")
showNewPair.addEventListener("click", getPair)