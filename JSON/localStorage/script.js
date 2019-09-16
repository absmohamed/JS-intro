function addHobby(event) {

  // event.preventDefault();
  let form = event.target;
  let name = form.elements[0].value;
  let hobby = form.elements[1].value;
  hobbies[name] = hobby;
  // Persist hobbies to localStorage
  // Have to stringify because localStorage will coerce anything we store to a string
  localStorage.setItem("hobbies", JSON.stringify(hobbies));

  // location.reload();
  console.log(localStorage.getItem("hobbies"));
}

let hobbies = JSON.parse(localStorage.getItem("hobbies")) || {}
console.log("hobbies at start of script from localStorage")
console.log(hobbies)
let hobbyForm = document.getElementById("name-hobby");
hobbyForm.addEventListener("submit", addHobby);