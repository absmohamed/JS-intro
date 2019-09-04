// Hoisting possible
x = 1; //initialize
console.log(x); //execute
var x; //declare

// Hoisting possible but the result is undefined as y
// has been declared but not initialized
console.log(y); //execute
var y; //declare
y = 1; //initialize

// Hoisting possible but the result is undefined as z
// has been declared but not initialized
console.log(z);
z = "Hello World";
var z;

// Hoisting NOT possible because we have used "let" instead of "var"
console.log(a);
let a = "Hello World using let";
// ReferenceError: a is not defined