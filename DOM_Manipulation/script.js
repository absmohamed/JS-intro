let newDiv = document.createElement("div");
document.body.appendChild(newDiv);
newDiv.innerHTML = "Appended a new Div to the body";


let title = document.querySelector("h1");

title.classList.add("blue");
title.classList.remove("blue");
// title.classList.toggle("blue")
title.style.paddingLeft = "100px";
title.classList.add("blue");
console.log(title.style.color);


console.log(window.getComputedStyle(title).getPropertyValue("color"));


// let formButton = document.querySelector("input[type=submit]")

// console.log(formButton.value)

// // We can assign multiple attributes at once using Object.assign()
// Object.assign(formButton, {
//     id: "form-button",
//     value: "Ok you can click"
// })