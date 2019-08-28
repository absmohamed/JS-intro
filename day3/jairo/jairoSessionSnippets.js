// first function says yabba dabba do
function sayHello() {
	alert("Yabba Dabba Do!")
}

// anonymous function to say yabba dabba do
const sayHello = function() {
	alert("Yabba Dabba Do!")
}

// random number generator - from 0-10
function randomNumber() {
	console.log(Math.floor(Math.random() * 11))
}

// Does multiple things - gets todays date and formats it, and gets a random number between 1-10, and console logs these with a greeting
function multitask() {
	var today = new Date()
	var date = today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear()
	var randomNumber = Math.floor(Math.random() * 10) + 1
	console.log("Today is " + date)
	console.log("Yabba Dabba Do!")
	console.log("Here is a random number: " + randomNumber)
}

// function returns a string
function sayHello() {
	return "Yabba Dabba Do!"
}

// function returns a random number between 1-10
function randomNumber() {
	var randomNum = Math.floor(Math.random() * 11)
	return randomNum
}

// sayHello takes a parameter
function sayHello(name) {
	return `Hello ${name}!`
}

// random number take a range (top value) and returns a number between 1 and range
function randomNumber(range) {
	var randomNum = Math.floor(Math.random() * range + 1)
	return randomNum
}

// returns a string that states which is the largest of the 2 numbers provided
function maxNumber(num1, num2) {
	var max = ""

	if (num1 > num2) {
		max = num1 + " is the largest number"
	} else {
		max = num2 + " is the largest number"
	}
	return max
}
