//Example 1
let answer = sum(1,2);
console.log(answer);
var sum = function(x,y) {
    return x + y;
}

//In the above example, the variable "var sum" is hoisted but not the assigned function
//hence it throws a TypeError: sum is not a function

// Example 2 : 
let answer = sum(1,2);
console.log(answer);
// var sum = function(x,y) {
function sum(x,y) {
    return x + y;
}

// The function declaration gets hoisted as well as the variable "var answer"
