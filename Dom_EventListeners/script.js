let formButton = document.querySelector("input[type=submit]");


formButton.addEventListener("click", function (event) {
  event.preventDefault()
  console.log(event)
  event.target.value += "!"
})